import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express()
app.use(cors({
    origin: process.env.CORS_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({extended:true,limit:"32kb"})) // for different url have diifferent format to write some use like %20 ,+
app.use(express.static("public")) // for the files that can put in own server like in public folder

app.use('/api/auth', userRouter);
app.use('/api/users', userRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'OK' });
});

app.use(errorHandler);

export default app;