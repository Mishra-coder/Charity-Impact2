const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, planType, charityId, charityPercentage, type, amount } = session.metadata;

    if (type === 'independent') {
      await supabase
        .from('charity_contributions')
        .insert([{
          user_id: userId,
          charity_id: charityId,
          percentage: 100,
          amount: session.amount_total / 100
        }]);

      await supabase
        .from('payments')
        .insert([{
          user_id: userId,
          amount: session.amount_total / 100,
          status: 'completed',
          payment_method: 'stripe',
          payment_intent_id: session.payment_intent
        }]);
    } else {
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
          user_id: userId,
          plan_type: planType,
          status: 'active',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          renewal_date: endDate.toISOString(),
          amount: session.amount_total / 100
        }])
        .select()
        .single();

      if (!subError && subscription) {
        await supabase
          .from('users')
          .update({ role: 'subscriber' })
          .eq('id', userId);

        const charityAmount = (session.amount_total / 100 * charityPercentage) / 100;
        await supabase
          .from('charity_contributions')
          .insert([{
            user_id: userId,
            charity_id: charityId,
            subscription_id: subscription.id,
            percentage: charityPercentage,
            amount: charityAmount
          }]);

        await supabase
          .from('payments')
          .insert([{
            user_id: userId,
            subscription_id: subscription.id,
            amount: session.amount_total / 100,
            status: 'completed',
            payment_method: 'stripe',
            payment_intent_id: session.payment_intent
          }]);
      }
    }
  }

  res.json({ received: true });
});

module.exports = router;
