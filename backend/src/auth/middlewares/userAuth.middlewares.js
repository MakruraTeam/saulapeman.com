import jwt from 'jsonwebtoken';
import User from '../schemas/user.schema.js';

export const userAuthorization = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = auth.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    console.log('decoded', decoded);
    if (err) return res.status(401).json({ error: 'Invalid token' });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    req.user = user;
    next();
  });
};
