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

app.get("/api",(req,res)=>{
  res.status(200).json({message:"Welcome to PEPE COIN API"})
})

app.get('/hello', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
});

// ROUTES
app.use('/',userRouter );

export default app;