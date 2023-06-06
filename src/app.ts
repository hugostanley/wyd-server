import * as dotenv from 'dotenv'
import { createServer } from 'http'
dotenv.config()
import express, { Express } from 'express'
import mongoose from 'mongoose'
import cors, { CorsOptions } from 'cors'
import * as routes from './routes/index.js'
import morgan from 'morgan'

/* import your websocket controllers 
import { Server } from 'socket.io'
import { feedHandler, userSearchHandler } from './websockets/index.js'
*/

const app: Express = express()
const server = createServer(app)

const PORT: string | number = process.env.PORT || 4000
const allowedOrigins = ["http://localhost:5173"]
const options: CorsOptions = {
  origin: allowedOrigins
}

/* Connect you controllers here 
 *
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  }
})

const onConnection = (socket) => {
  feedHandler(io, socket)
  userSearchHandler(io, socket)
}

io.on('connection', onConnection)
 * */

app.use(cors(options))
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


