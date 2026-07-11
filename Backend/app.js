import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()
app.use(cors({
    origin: process.env.CORS_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({extended:true,limit:"32kb"})) // for different url have diifferent format to write some use like %20 ,+
app.use(express.static("public")) // for the files that can put in own server like in public folder

//route import
import userRouter from './routes/user.routes.js'

//route declaration 
// eg  app.use("/api/v1/users",userRouter)

export default app;