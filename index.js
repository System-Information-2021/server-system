const express = require('express')
const app = express()
const port = 3000

require('dotenv').config()

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
  res.json({
    message : 'heelo'
  })
})
