import { TodoModel } from '../models/index.js'
async function feedUpdater(socket: any, id: any) {
  try {
    const taskList = await TodoModel.find({ createdByUser: id })
    socket.emit('feed_updated', taskList)
  } catch (error) {
    console.error(error)
  }
}
export function todoHandler(io: any, socket: any) {
  socket.on('get_feed', (id: string) => feedUpdater(socket, id))
}

