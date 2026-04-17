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
  body('scoreValue').isInt({ min: 0, max: 200 }),
  body('scoreDate').isISO8601(),
  body('courseId').optional().isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Validation failed', errors: errors.array() } });
    }

    const { scoreValue, scoreDate, courseId } = req.body;

    const { data: score, error } = await supabase
      .from('scores')
      .insert([{
        user_id: req.user.id,
        score_value: scoreValue,
        score_date: scoreDate,
        course_id: courseId
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: { message: 'Failed to save score' } });
    }

    res.status(201).json({ success: true, data: score });
  } catch (error) {
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
