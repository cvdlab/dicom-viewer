const path = require('path')
const express = require('express')

const app = express()

const APP_PORT = 3000
const API_VERSION = '0'
const API_ROOT = path.join('api', API_VERSION)

app.use(express.static('public'))

app.get(path.join(API_ROOT, 'slices/:coord/:number'), function (req, res) {
  let coord = req.params.coord
  let number = req.params.number
  res.send(`slice ${coord} ${number}`)
})

app.listen(APP_PORT, function () {
  console.log(`Server listening on port ${APP_PORT}!`)
})