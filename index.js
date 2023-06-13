const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')  //Express package for api call on local host


connectToMongo();
const app = express()
const port =process.env.port || 5000  // to give spacre for front end

//middleware
app.use(express.json())

app.use(cors()) //package

// app.get('/', (req, res) => {
//     res.send('Hello Yash Bhau')
// })

//heating help created apis 
//available routes
app.use('/api/auth',require('./routes/auth')) 
app.use('/api/notes',require('./routes/notes'))


app.listen(port, () => {
    console.log(`iNotebook app listening at http://localhost:${port}`)
})