import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./routes/authRoutes.js"
import hotelRoutes from "./routes/HotelRoutes.js"
import roomRoutes from "./routes/RoomRoutes.js"
import usersRoutes from "./routes/UserRoutes.js"
import cookieParser from "cookie-parser"
import  cors from "cors"
mongoose.set('strictQuery', false)


const app = express()
dotenv.config()

console.log("process.env.MONGO_URI",process.env.MONGO_URI)
const DB = process.env.MONGO_URI

const connect =async ()=>{
  try {
   await mongoose.connect(DB)
   console.log("connected to mongoDB")
  } catch (error) {
    throw error
  }
} 
mongoose.connection.on("disconnected",()=>{
  console.log("mongoDB disconnected")
})

// middleWares
app.use(
  cors({
    allowedHeaders: ["authorization", "Content-Type"], // you can change the headers
    exposedHeaders: ["authorization"], // you can change the headers
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
  })
);
app.use(cookieParser())
app.use(express.json())

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/users",usersRoutes)
app.use("/api/v1/hotels",hotelRoutes)
app.use("/api/v1/rooms",roomRoutes)

app.use((err,req,res,next)=>{
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something Went wrong!";
  return res.status(errorStatus).json({
    success:false,
    status:errorStatus,
    message:errorMessage,
    stack:err.stack
  })

})

app.listen(8000,()=>{
  connect()
  console.log("connected to backend")
})