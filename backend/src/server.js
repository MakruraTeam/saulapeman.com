import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectToDatabase } from './database/connection.js';
import { createDefaultAccount } from './auth/controllers/register.controller.js';

import authRouter from './auth/routes/auth.routes.js';
import fileRouter from './file/routes/file.routes.js';
import { createRecycleBin } from './file/controllers/recycleBin.controller.js';

dotenv.config();
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);

app.listen(process.env.PORT, async () => {
  await connectToDatabase();
  await createDefaultAccount();
  await createRecycleBin();
  console.log(`Server is running on port ${process.env.PORT}`);
});
