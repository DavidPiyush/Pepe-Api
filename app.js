import express from "express"
import cors from "cors"
import userRouter from "./routers/userRoutes.js"
import cookieParser from "cookie-parser";

// Start express app
const app = express();
app.use(
  cors()
);
app.use(express.json())

app.enable('trust proxy');
app.use(cookieParser());


// ROUTES
app.use('/',userRouter );

export default app;