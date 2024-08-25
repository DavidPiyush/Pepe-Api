import mongoose from 'mongoose'
import dotenv from "dotenv"
import app from "./app.js"

dotenv.config()


const PORT = process.env.PORT || 5500;
const MONGO_URI = process.env.MONGO_URL;

mongoose.connect(MONGO_URI).then(()=>{
    console.log("DataBase is sucessfully connected!")
    app.listen(PORT,()=> console.log("Server started "+ PORT))
}).catch((error)=>console.error(error))






