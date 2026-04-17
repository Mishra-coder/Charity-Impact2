const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');

router.use(authenticate);
router.use(isAdmin);

router.get('/users', async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        *,
        subscriptions:subscriptions(status, plan_type, end_date)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to fetch users' } });
    }

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.put('/users/:userId/role', [
  body('role').isIn(['visitor', 'subscriber', 'admin'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
    }

    const { userId } = req.params;
    const { role } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to update user role' } });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.post('/draws', [
  body('drawType').isIn(['5-match', '4-match', '3-match']),
  body('drawDate').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
    }

    const { drawType, drawDate } = req.body;

    const { count: subscriberCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const monthlyFee = 100;
    let prizePoolPercentage = 0.40;
    
    if (drawType === '5-match') {
      prizePoolPercentage = 0.40;
    } else if (drawType === '4-match') {
      prizePoolPercentage = 0.35;
    } else {
      prizePoolPercentage = 0.25;
    }

    const totalPrizePool = subscriberCount * monthlyFee * prizePoolPercentage;

    const { data: draw, error } = await supabase
      .from('draws')
      .insert([{
        draw_type: drawType,
        draw_date: drawDate,
        status: 'pending',
        total_prize_pool: totalPrizePool
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to create draw' } });
    }

    res.status(201).json({ success: true, data: draw });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.post('/draws/:drawId/execute', async (req, res) => {
  try {
    const { drawId } = req.params;

    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .select('*')
      .eq('id', drawId)
      .eq('status', 'pending')
      .single();

    if (drawError || !draw) {
      return res.status(404).json({ error: { message: 'Draw not found or already executed' } });
    }

    const { data: entries, error: entriesError } = await supabase
      .from('draw_entries')
      .select('*')
      .eq('draw_id', drawId);

    if (entriesError || !entries || entries.length === 0) {
      return res.status(400).json({ error: { message: 'No entries found for this draw' } });
    }

    const winningNumbers = [];
    while (winningNumbers.length < 5) {
      const num = Math.floor(Math.random() * 46) + 1;
      let exists = false;
      for (let i = 0; i < winningNumbers.length; i++) {
        if (winningNumbers[i] === num) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        winningNumbers.push(num);
      }
    }

    let maxMatches = 0;
    let winners = [];

    for (const entry of entries) {
      const entryNumbers = JSON.parse(entry.entry_numbers);
      let matches = 0;
      
      for (let i = 0; i < entryNumbers.length; i++) {
        for (let j = 0; j < winningNumbers.length; j++) {
          if (entryNumbers[i] === winningNumbers[j]) {
            matches++;
            break;
          }
        }
      }

      await supabase
        .from('draw_entries')
        .update({ matched_count: matches })
        .eq('id', entry.id);

      if (matches > maxMatches) {
        maxMatches = matches;
        winners = [entry];
      } else if (matches === maxMatches && matches >= 3) {
        winners.push(entry);
      }
    }

    let winnerId = null;
    if (winners.length > 0 && maxMatches >= 3) {
      const winner = winners[Math.floor(Math.random() * winners.length)];
      winnerId = winner.user_id;

      await supabase
        .from('draw_entries')
        .update({ is_winner: true })
        .eq('id', winner.id);
    }

    const { data: updatedDraw, error: updateError } = await supabase
      .from('draws')
      .update({
        status: 'completed',
        winning_numbers: JSON.stringify(winningNumbers),
        winner_id: winnerId
      })
      .eq('id', drawId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: { message: 'Failed to update draw' } });
    }

    res.json({
      success: true,
      data: {
        draw: updatedDraw,
        winningNumbers,
        maxMatches,
        winnersCount: winners.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.get('/draws/:drawId/entries', async (req, res) => {
  try {
    const { drawId } = req.params;

    const { data: entries, error } = await supabase
      .from('draw_entries')
      .select(`
        *,
        users:user_id (
          email,
          full_name
        )
      `)
      .eq('draw_id', drawId)
      .order('matched_count', { ascending: false });

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to fetch entries' } });
    }

    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.get('/verifications', async (req, res) => {
  try {
    const { data: verifications, error } = await supabase
      .from('winner_verifications')
      .select(`
        *,
        users:user_id (
          email,
          full_name
        ),
        draws:draw_id (
          draw_type,
          draw_date,
          total_prize_pool
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to fetch verifications' } });
    }

    res.json({ success: true, data: verifications });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.put('/verifications/:verificationId', [
  body('status').isIn(['approved', 'rejected']),
  body('adminNotes').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
    }

    const { verificationId } = req.params;
    const { status, adminNotes } = req.body;

    const { data: verification, error } = await supabase
      .from('winner_verifications')
      .update({
        status,
        admin_notes: adminNotes,
        verified_by: req.user.id,
        verified_at: new Date().toISOString()
      })
      .eq('id', verificationId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to update verification' } });
    }

    res.json({ success: true, data: verification });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.post('/charities', [
  body('name').trim().notEmpty(),
  body('description').optional(),
  body('logoUrl').optional().isURL(),
  body('websiteUrl').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
    }

    const { name, description, logoUrl, websiteUrl } = req.body;

    const { data: charity, error } = await supabase
      .from('charities')
      .insert([{
        name,
        description,
        logo_url: logoUrl,
        website_url: websiteUrl,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to create charity' } });
    }

    res.status(201).json({ success: true, data: charity });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.put('/charities/:charityId', async (req, res) => {
  try {
    const { charityId } = req.params;
    const { name, description, logoUrl, websiteUrl, isActive } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (logoUrl !== undefined) updateData.logo_url = logoUrl;
    if (websiteUrl !== undefined) updateData.website_url = websiteUrl;
    if (isActive !== undefined) updateData.is_active = isActive;

    const { data: charity, error } = await supabase
      .from('charities')
      .update(updateData)
      .eq('id', charityId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to update charity' } });
    }

    res.json({ success: true, data: charity });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: activeSubscribers } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { data: draws } = await supabase
      .from('draws')
      .select('total_prize_pool');
    
    let totalPrizePool = 0;
    if (draws) {
      for (let i = 0; i < draws.length; i++) {
        totalPrizePool += parseFloat(draws[i].total_prize_pool || 0);
      }
    }

    const { data: contributions } = await supabase
      .from('charity_contributions')
      .select('amount');
    
    let totalCharityAmount = 0;
    if (contributions) {
      for (let i = 0; i < contributions.length; i++) {
        totalCharityAmount += parseFloat(contributions[i].amount || 0);
      }
    }

    const { count: pendingVerifications } = await supabase
      .from('winner_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    res.json({
      success: true,
      data: {
        totalUsers,
        activeSubscribers,
        totalPrizePool,
        totalCharityAmount,
        pendingVerifications
      }
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.delete('/charities/:charityId', async (req, res) => {
  try {
    const { charityId } = req.params;

    const { error } = await supabase
      .from('charities')
      .delete()
      .eq('id', charityId);

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to delete charity' } });
    }

    res.json({ success: true, message: 'Charity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
