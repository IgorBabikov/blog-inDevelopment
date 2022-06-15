import express from 'express'
import mongoose  from 'mongoose'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { registerValidation } from './validations/auth.js'
import {validationResult} from 'express-validator'
import UserSchema from './models/User.js'

dotenv.config()

const app = express()
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
      const hash = await bcrypt.hash(password, salt)

      const doc = new UserSchema({
         email: req.body.email,
         passwordHash: hash,
         fullName: req.body.fullName,
         avatarUrl: req.body.avatarUrl
      })

      const user = await doc.save()

      const token = jwt.sign({
         _id: user._id
      }, secretKey, {
         expiresIn: '30d'
      })


      const {passwordHash, ...userData} = user._doc

      res.json({
         ...userData,
         token
      })

   } catch(e) {
      console.log(e)
      res.status(500).json({
         message: 'Не удалось зарегистрироваться'
      })
   }
})


app.post('/auth/login', async (req, res) => {
   try {
    const user = await UserSchema.findOne({email: req.body.email})

    if (!user) {
      return res.status(404).json({
         message: 'Пользователь не найден'
      })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if (!isValidPass) {
      return res.status(400).json({
         message: 'Неверный логин или пароль'
      })
    }

    const token = jwt.sign({
      _id: user._doc
    }, secretKey, {
      expiresIn: '30d'
    })

    const {passwordHash, ...userData} = user._doc

    res.json({
      ...userData,
      token
    })

   } catch(e) {
      console.log(e)
      res.status(500).json({
         message: 'Не удалось авторизоваться'
      })
   }
})




app.listen(port, (err) => {
   err ? console.log(`error: ${err}`) : console.log(`server started: ${port}`)
})