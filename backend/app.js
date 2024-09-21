import express from 'express'
import authRouter from './routes/userRoute.js';
import connectToDb from './config/dbConn.js';
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url';
import resumeRouter from './routes/resumeRoute.js';
import cors from 'cors';
const app = express();
connectToDb()
app.use(express.json()); // Built-in middleware
app.use(cookieParser()); // Third-party middleware


app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true }));

app.use('/api/auth',authRouter)
app.use('/api/auth/resume',resumeRouter)

export default app;