const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  try {
    const { data: charities, error } = await supabase
      .from('charities')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to fetch charities' } });
    }

    res.json({ success: true, data: charities });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.get('/contributions', authenticate, async (req, res) => {
  try {
    const { data: contributions, error } = await supabase
      .from('charity_contributions')
      .select(`
        *,
        charities:charity_id (
          name,
          logo_url,
          description
        )
      `)
      .eq('user_id', req.user.id)
      .order('contribution_date', { ascending: false });

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to fetch contributions' } });
    }

    res.json({ success: true, data: contributions });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const { data: stats, error } = await supabase
      .from('charity_contributions')
      .select(`
        charity_id,
        amount,
        charities:charity_id (
          name,
          logo_url
        )
      `);

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to fetch stats' } });
    }

    const charityStats = {};
    stats.forEach(contribution => {
      const charityId = contribution.charity_id;
      if (!charityStats[charityId]) {
        charityStats[charityId] = {
          charity: contribution.charities,
          totalAmount: 0,
          contributionCount: 0
        };
      }
      charityStats[charityId].totalAmount += parseFloat(contribution.amount || 0);
      charityStats[charityId].contributionCount += 1;
    });

    res.json({ success: true, data: Object.values(charityStats) });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
