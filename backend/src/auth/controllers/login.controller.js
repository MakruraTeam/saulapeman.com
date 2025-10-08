import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserSchema from '../schemas/user.schema.js';

export const loginController = async (req, res) => {
  const { username, password, rememberMe = false } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await UserSchema.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: rememberMe ? '30d' : '2h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
