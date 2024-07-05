const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')


const app = express()
const allowedOrigins = 'http://localhost:3000';

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow requests with no origin
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));


app.options('*', cors());


app.use(express.json())
app.use(cookieParser())

// app.use("/",(req,res)=>{
//     return res.json({
//         message:"welcome"
//     });
// }
// )

app.use("/api",router)

const PORT =  process.env.PORT || 5000 


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connnect to DB")
        console.log("Server is running "+PORT);
    })
})
