import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectToDatabase } from './database/connection.js';
import { createDefaultAccount } from './auth/controllers/register.controller.js';

import authRouter from './auth/routes/auth.routes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRouter);

app.listen(process.env.PORT, async () => {
  await connectToDatabase();
  await createDefaultAccount();
  console.log(`Server is running on port ${process.env.PORT}`);
});
