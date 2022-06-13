import express from 'express'
import mongoose  from 'mongoose'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { registerValidation } from './validations/auth.js'
import {validationResult} from 'express-validator'


const app = express()
dotenv.config()
const port = process.env.PORT || 3000
const secretKey = process.env.SECRET_KEY
const login = process.env.LOGIN
const password = process.env.PASSWORD

mongoose.connect(`mongodb://${login}:${password}@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/brsdtk9edfmbpfn?replicaSet=rs0`)
.then(() => console.log('Start DB'))
.catch(() => console.log('error'))


app.use(express.json())


app.post('/auth/register', registerValidation, (req, res) => {
   const err = validationResult(req);
   if (!err.isEmpty()) {
      return res.status(400).json(err.array())
   }

   res.json({
      success: true
   })
})

app.listen(port, (err) => {
   err ? console.log(`error: ${err}`) : console.log(`server started: ${port}`)
})