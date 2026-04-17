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

    const startDate = new Date();
    const endDate = new Date();
    if (planType === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: req.user.id,
        plan_type: planType,
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        renewal_date: endDate.toISOString(),
        amount
      }])
      .select()
      .single();

    if (subError) {
      return res.status(500).json({ error: { message: 'Failed to create subscription' } });
    }

    await supabase
      .from('users')
      .update({ role: 'subscriber' })
      .eq('id', req.user.id);

    const charityAmount = (amount * charityPercentage) / 100;
    await supabase
      .from('charity_contributions')
      .insert([{
        user_id: req.user.id,
        charity_id: charityId,
        subscription_id: subscription.id,
        percentage: charityPercentage,
        amount: charityAmount
      }]);

    await supabase
      .from('payments')
      .insert([{
        user_id: req.user.id,
        subscription_id: subscription.id,
        amount,
        status: 'completed',
        payment_method: 'stripe'
      }]);

    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
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
