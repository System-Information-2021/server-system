const express = require('express')
const app = express()
// const port = 3000

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${process.env.PORT || 3000}`)
})

app.get('/', (req, res) => {
  res.json({
    message : 'heelo'
  })
})
