import { TodoModel } from '../models/index.js'
async function feedUpdater(socket: any) {
  try {
    console.log('getting!')
    const taskList = await TodoModel.find()
    socket.emit('feed_updated', taskList)
  } catch (error) {
    console.error(error)
  }
}
export function todoHandler(io: any, socket: any) {
  socket.on('update_feed', () => feedUpdater(socket))
  socket.on('get_feed', () => feedUpdater(socket))
}

