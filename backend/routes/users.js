const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const supabase = require('../config/supabase');

router.get('/me', authenticate, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, created_at')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.put('/me', authenticate, async (req, res) => {
  try {
    const { fullName } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({ full_name: fullName })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: { message: 'Failed to update profile' } });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .single();

    const { data: scores } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', req.user.id)
      .order('score_date', { ascending: false })
      .limit(5);

    const { data: drawEntries } = await supabase
      .from('draw_entries')
      .select(`
        *,
        draws:draw_id (
          draw_type,
          draw_date,
          status,
          total_prize_pool
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: contributions } = await supabase
      .from('charity_contributions')
      .select(`
        *,
        charities:charity_id (
          name,
          logo_url
        )
      `)
      .eq('user_id', req.user.id)
      .order('contribution_date', { ascending: false })
      .limit(5);

    res.json({
      success: true,
      data: {
        subscription: subscription || null,
        scores: scores || [],
        drawEntries: drawEntries || [],
        contributions: contributions || []
      }
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
