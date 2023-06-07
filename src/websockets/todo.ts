// @ts-nocheck
import { TodoModel, UserModel } from '../models/index.js'
async function feedUpdater(socket: any, id: any) {
  try {
    const currentUser = await UserModel.findById(id).populate({
      path: 'friends',
      populate: {
        path: 'requester recipient',
        model: 'User'
      }
    }).exec()
    if (currentUser) {
      const friendIdArr = currentUser.friends.map(item => {
        if (item.status === "friends") {
          if (item.recipient._id.toString() !== currentUser.id) {
            return item.recipient._id.toString()
          } else if (item.requester._id.toString() !== currentUser.id) {
            return item.requester._id.toString()
          }
        }
      })
      const taskList = await TodoModel.find({ createdByUser: { $in: [...friendIdArr, currentUser.id] } })
      socket.emit('feed_updated', taskList)
    }
  } catch (error) {
    console.error(error)
  }
}
export function todoHandler(io: any, socket: any) {
  socket.on('get_feed', (id: string) => feedUpdater(socket, id))
}

