const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');

router.get('/me', authenticate, async (req, res) => {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: { message: 'Failed to fetch subscription' } });
    }

    res.json({ success: true, data: subscription || null });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.post('/', [
  authenticate,
  body('planType').isIn(['monthly', 'yearly']),
  body('charityId').isUUID(),
  body('charityPercentage').isFloat({ min: 10, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
    }

    const { planType, charityId, charityPercentage } = req.body;

    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .single();

    if (existingSub) {
      return res.status(400).json({ error: { message: 'Active subscription already exists' } });
    }

    const monthlyPrice = 100;
    const yearlyPrice = 1000;
    const amount = planType === 'monthly' ? monthlyPrice : yearlyPrice;
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `${planType === 'monthly' ? 'Explorer' : 'Annual'} Membership`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription`,
      metadata: {
        userId: req.user.id,
        planType,
        charityId,
        charityPercentage
      }
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to initiate payment' } });
  }
});

router.post('/cancel', authenticate, async (req, res) => {
  try {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to cancel subscription' } });
    }

    res.json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
