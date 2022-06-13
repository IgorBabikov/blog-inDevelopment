const express = require('express')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const app = express()
const port = process.env.PORT || 3000
const secretKey = process.env.SECRET_KEY

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