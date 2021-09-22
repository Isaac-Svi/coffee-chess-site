require('dotenv').config()
const express = require('express')

const { PORT } = process.env

const app = express()

app.get('/test', (req, res) => {
    res.send('howdy')
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
