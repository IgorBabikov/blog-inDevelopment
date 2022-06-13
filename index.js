import express from 'express'
import mongoose  from 'mongoose'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { registerValidation } from './validations/auth.js'
import {validationResult} from 'express-validator'
import UserSchema from './models/User.js'


const app = express()
dotenv.config()
const port = process.env.PORT || 3000
const secretKey = process.env.SECRET_KEY
const login = process.env.LOGIN
const passwordMD = process.env.PASSWORD

mongoose.connect(`mongodb://${login}:${passwordMD}@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/brsdtk9edfmbpfn?replicaSet=rs0`)
.then(() => console.log('Start DB'))
.catch(() => console.log('error'))


app.use(express.json())


app.post('/auth/register', registerValidation, async (req, res) => {
   try {
      const err = validationResult(req);
      if (!err.isEmpty()) {
         return res.status(400).json(err.array())
      }

      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt)

      const doc = new UserSchema({
         email: req.body.email,
         passwordHash,
         fullName: req.body.fullName,
         avatarUrl: req.body.avatarUrl
      })

      const user = await doc.save()

      res.json(user)
   } catch(e) {
      console.log(e)
      res.status(500).json({
         message: 'Не удалось зарегистрироваться'
      })
   }
})



app.listen(port, (err) => {
   err ? console.log(`error: ${err}`) : console.log(`server started: ${port}`)
})