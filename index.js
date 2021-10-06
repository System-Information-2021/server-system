const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send("server is runing!")
})

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${process.env.PORT || 3000}`)
})
