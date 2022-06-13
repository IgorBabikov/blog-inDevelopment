const express = require('express')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
   res.send('get main page!')
})

app.listen(port, (err) => {
   err ? console.log(`error: ${err}`) : console.log(`server started: ${port}`)
})