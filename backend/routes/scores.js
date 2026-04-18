const express = require('express');
const router = express.Router();
const { authenticate, isSubscriber } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');

router.get('/', authenticate, async (req, res) => {
  try {
    const { data: scores, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', req.user.id)
      .order('score_date', { ascending: false });

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to fetch scores' } });
    }

    res.json({ success: true, data: scores || [] });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

router.post('/', [
  authenticate,
  isSubscriber,
  body('scoreValue').isInt({ min: 1, max: 45 }),
  body('scoreDate').isISO8601(),
  body('courseId').optional().isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
    }

    const { scoreValue, scoreDate, courseId } = req.body;

    const { data: existingScore } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('score_date', scoreDate)
      .single();

    if (existingScore) {
      return res.status(400).json({ error: { message: 'A score for this date already exists' } });
    }

    const { data: score, error: insertError } = await supabase
      .from('scores')
      .insert([{
        user_id: req.user.id,
        score_value: scoreValue,
        score_date: scoreDate,
        course_id: courseId
      }])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: { message: 'Failed to save score' } });
    }

    const { count } = await supabase
      .from('scores')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.id);

    if (count > 5) {
      const { data: oldestScore } = await supabase
        .from('scores')
        .select('id')
        .eq('user_id', req.user.id)
        .order('score_date', { ascending: true })
        .limit(1)
        .single();

      if (oldestScore) {
        await supabase
          .from('scores')
          .delete()
          .eq('id', oldestScore.id);
      }
    }

    res.status(201).json({ success: true, data: score });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
