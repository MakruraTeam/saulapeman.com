import bcrypt from 'bcrypt';
import UserSchema from '../schemas/user.schema.js';
import dotenv from 'dotenv';

dotenv.config();

export const registerController = async (req, res) => {
  const { username, password, repeatPassword } = req.body;

  if (!username || !password || !repeatPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== repeatPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;
  try {
    const user = await UserSchema.create({
      username,
      password: hashedPassword,
    });
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createDefaultAccount = async () => {
  const adminLogin = process.env.ADMIN_PANEL_LOGIN;
  const adminPassword = process.env.ADMIN_PANEL_PASSWORD;

  if (!adminLogin || !adminPassword) {
    console.log('Admin credentials are not set in environment variables.');
    return;
  }

  try {
    const existingAdmin = await UserSchema.findOne({ username: adminLogin });

    if (!existingAdmin) {
      const hashedPassword = bcrypt.hashSync(adminPassword, 10);
      await UserSchema.create({
        username: adminLogin,
        password: hashedPassword,
      });

      console.log('Default admin account created.');
    }
  } catch (error) {
    console.error('Error creating default admin account:', error);
  }
};
