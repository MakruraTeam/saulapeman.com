import jwt from 'jsonwebtoken';
import User from '../schemas/user.schema.js';
import crypto from 'crypto';

export const logoutController = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = auth.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });

      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ error: 'Invalid token' });

      user.tokenHash = crypto.randomBytes(16).toString('hex');
      await user.save();

      return res.status(200).json({ message: 'Logged out successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
