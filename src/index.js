const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const cors = require('cors')

const { setupWebSocket } = require('./websocket')

const routes = require('./routes')

require('dotenv').config()

const app = express()
const server = http.Server(app)

setupWebSocket(server)

const PORT = process.env.PORT || 3333
const DB = process.env.DB

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
    }).then( () => { 
        console.log('DB Connection ON')
    }).catch( (error) => {
        console.log(`DB Connection ERROR: ${error}`)
    }
)

app.use(express.json());
app.use(cors())

app.use(routes)

server.listen(PORT, function(){
    console.log(`Server running on ${this.address().port}`)
})