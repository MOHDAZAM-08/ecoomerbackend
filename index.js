const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')


const app = express()
app.use(cors())


app.use(express.json())
app.use(cookieParser())

app.use("/",(req,res)=>{
    return res.json({
        message:"welcome"
    });
}
)

app.use("/api",router)

const PORT =  process.env.PORT || 5000 


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connnect to DB")
        console.log("Server is running "+PORT);
    })
})
