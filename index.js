const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const app = express()
const port = process.env.PORT || 3000
const secretKey = process.env.SECRET_KEY
const login = process.env.LOGIN
const password = process.env.PASSWORD

mongoose.connect(`mongodb://${login}:${password}@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/brsdtk9edfmbpfn?replicaSet=rs0`)
.then(() => console.log('Start DB'))
.catch(() => console.log('error'))



app.use(express.json())

app.get('/', (req, res) => {
   res.send('get main page!')
})

app.post('/auth/login', (req, res) => {

   const token = jwt.sign({
      email: req.body.email,
      fullName: 'Игорь Бабиков'
   }, secretKey)

   res.json({
      success: true,
      token
   })
})

app.listen(port, (err) => {
   err ? console.log(`error: ${err}`) : console.log(`server started: ${port}`)
})