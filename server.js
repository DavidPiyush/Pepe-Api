import mongoose from 'mongoose'
import dotenv from "dotenv"
import app from "./app.js"

dotenv.config()


const PORT = process.env.PORT || 5500;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(()=>{
    console.log("DataBase is sucessfully connected!")
    app.listen(PORT,()=> console.log("Server started "+ PORT))
}).catch((error)=>console.error(error))






