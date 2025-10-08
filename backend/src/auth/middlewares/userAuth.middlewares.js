import jwt from 'jsonwebtoken';
import User from '../schemas/user.schema.js';

export const userAuthorization = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = auth.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    if (decoded.tokenHash !== user.tokenHash) {
      return res.status(401).json({ error: 'Token no longer valid (logged out)' });
    }

    req.user = user;
    next();
  });
};
