import express from "express"
import cors from "cors"
import userRouter from "./routers/userRoutes.js"
import cookieParser from "cookie-parser";

// Start express app
const app = express();
app.use(
  cors({
    origin: 'https://pepe-coin-api.vercel.app/', // Replace with your React app's Vercel URL
  })
);
app.use(express.json())

app.enable('trust proxy');
app.use(cookieParser());


// ROUTES
app.use('/',userRouter );

export default app;