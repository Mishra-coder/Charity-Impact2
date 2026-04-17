const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: { message: 'No token provided' } });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: { message: 'Invalid token format' } });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: { message: 'Invalid token' } });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: { message: 'Access denied' } });
  }
  next();
};

const isSubscriber = async (req, res, next) => {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('status', 'active')
      .single();

    if (!subscription) {
      return res.status(403).json({ error: { message: 'Active subscription required' } });
    }

    req.subscription = subscription;
    next();
  } catch (error) {
    return res.status(500).json({ error: { message: 'Error checking subscription' } });
  }
};

module.exports = { authenticate, isAdmin, isSubscriber };
