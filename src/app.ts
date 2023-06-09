import * as dotenv from 'dotenv'
import { createServer } from 'http'
dotenv.config()
import express, { Express } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import * as routes from './routes/index.js'
import morgan from 'morgan'
import { Server, Socket } from 'socket.io'
import { todoHandler, friendsHandler, ClientToServerEvents, ServerToClientEvents } from './websockets/index.js'

const app: Express = express()
const server = createServer(app)

const FRONT_END: string = process.env.FRONT_END!
const PORT: string | number = process.env.PORT || 4000

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: [FRONT_END],
  },
})

const onConnection = (socket: Socket) => {
  todoHandler(io, socket)
  friendsHandler(io, socket)
}

io.on('connection', onConnection)

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

Object.values(routes).forEach(route => {
  app.use(route)
})

/* Modify as you please */
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@wyd-server.kus8b6f.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(uri, {
}).then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}).catch(error => { throw error })


