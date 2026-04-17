const express = require('express');
const router = express.Router();
const { authenticate, isSubscriber } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');

router.get('/', authenticate, async (req, res) => {
  try {
    const { data: draws, error } = await supabase
      .from('draws')
      .select('*')
      .order('draw_date', { ascending: false })
      .limit(20);

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to fetch draws' } });
    }

    res.json({ success: true, data: draws });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.get('/upcoming', authenticate, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: draws, error } = await supabase
      .from('draws')
      .select('*')
      .gte('draw_date', today)
      .eq('status', 'pending')
      .order('draw_date', { ascending: true });

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to fetch upcoming draws' } });
    }

    res.json({ success: true, data: draws });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.get('/my-entries', authenticate, async (req, res) => {
  try {
    const { data: entries, error } = await supabase
      .from('draw_entries')
      .select(`
        *,
        draws:draw_id (
          draw_type,
          draw_date,
          status,
          total_prize_pool,
          winning_numbers
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to fetch entries' } });
    }

    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.post('/enter/:drawId', [authenticate, isSubscriber], async (req, res) => {
  try {
    const { drawId } = req.params;

    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .select('*')
      .eq('id', drawId)
      .eq('status', 'pending')
      .single();

    if (drawError || !draw) {
      return res.status(404).json({ error: { message: 'Draw not found or not available' } });
    }

    const { data: existingEntry } = await supabase
      .from('draw_entries')
      .select('id')
      .eq('draw_id', drawId)
      .eq('user_id', req.user.id)
      .single();

    if (existingEntry) {
      return res.status(400).json({ error: { message: 'Already entered this draw' } });
    }

    const { data: scores, error: scoresError } = await supabase
      .from('scores')
      .select('score_value')
      .eq('user_id', req.user.id)
      .order('score_date', { ascending: false })
      .limit(5);

    if (scoresError || !scores || scores.length < 5) {
      return res.status(400).json({ error: { message: 'You need at least 5 scores to enter a draw' } });
    }

    const entryNumbers = scores.map(s => s.score_value);

    const { data: entry, error: entryError } = await supabase
      .from('draw_entries')
      .insert([{
        draw_id: drawId,
        user_id: req.user.id,
        entry_numbers: JSON.stringify(entryNumbers)
      }])
      .select()
      .single();

    if (entryError) {
      return res.status(500).json({ error: { message: 'Failed to enter draw' } });
    }

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.post('/verify/:drawId', [
  authenticate,
  body('screenshotUrl').isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
    }

    const { drawId } = req.params;
    const { screenshotUrl } = req.body;

    const { data: entry, error: entryError } = await supabase
      .from('draw_entries')
      .select('*')
      .eq('draw_id', drawId)
      .eq('user_id', req.user.id)
      .eq('is_winner', true)
      .single();

    if (entryError || !entry) {
      return res.status(404).json({ error: { message: 'You are not a winner of this draw' } });
    }

    const { data: existingVerification } = await supabase
      .from('winner_verifications')
      .select('id')
      .eq('draw_id', drawId)
      .eq('user_id', req.user.id)
      .single();

    if (existingVerification) {
      return res.status(400).json({ error: { message: 'Verification already submitted' } });
    }

    const { data: verification, error: verifyError } = await supabase
      .from('winner_verifications')
      .insert([{
        draw_id: drawId,
        user_id: req.user.id,
        screenshot_url: screenshotUrl,
        status: 'pending'
      }])
      .select()
      .single();

    if (verifyError) {
      return res.status(500).json({ error: { message: 'Failed to submit verification' } });
    }

    res.status(201).json({ success: true, data: verification });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
