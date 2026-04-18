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

router.get('/stats', authenticate, async (req, res) => {
  try {
    const { data: userContributions, error: userError } = await supabase
      .from('charity_contributions')
      .select('amount, charity_id')
      .eq('user_id', req.user.id);

    if (userError) {
      return res.status(500).json({ error: { message: 'Failed to fetch stats' } });
    }

    let totalContributed = 0;
    const uniqueCharities = new Set();

    userContributions.forEach(contribution => {
      totalContributed += parseFloat(contribution.amount || 0);
      uniqueCharities.add(contribution.charity_id);
    });

    res.json({ 
      success: true, 
      data: {
        totalContributed: totalContributed.toFixed(2),
        contributionCount: userContributions.length,
        charitiesSupported: uniqueCharities.size
      }
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.post('/donate', authenticate, async (req, res) => {
  try {
    const { charityId, amount } = req.body;
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Independent Impact Donation',
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/impact?status=success`,
      cancel_url: `${process.env.FRONTEND_URL}/impact`,
      metadata: {
        userId: req.user.id,
        type: 'independent',
        charityId,
        amount
      }
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to initiate donation' } });
  }
});

module.exports = router;
