// @ts-nocheck
import { UserModel } from "../models/index.js"

async function friendsListUpdater(socket, id, io) {
  try {
    const user = await UserModel.findById(id).populate({
      path: 'friends',
      populate: {
        path: 'requester recipient',
        model: 'User'
      }
    }).exec()
    if (user) {
      // @ts-ignore
      const friendsList = user.friends.filter(item => item.status === "friends")
      const friendIds = friendsList.map(item => {
        if (item.recipient._id.toString() !== user.id) {
          return item.recipient._id.toString()
        } else if (item.requester._id.toString() !== user.id) {
          return item.requester._id.toString()
        }
      })
      friendIds.push(user.id)
      friendIds.forEach(id => {
        io.to(id).emit('friends_updated', friendsList)
      })
    }
  } catch (error) {
    console.error(error)
  }
}

async function pendingFriendsListUpdater(socket, id, io) {
  try {
    const user = await UserModel.findById(id).populate({
      path: 'friends',
      populate: {
        path: 'requester recipient',
      }
    }).exec()

    if (user) {
      // @ts-ignore
      const friendsList = user.friends.filter(friendship => friendship.status === "pending")
      const pendingFriendIds = friendsList.map(item => {
        if (item.recipient._id.toString() !== user.id) {
          return item.recipient._id.toString()
        } else if (item.requester._id.toString() !== user.id) {
          return item.requester._id.toString()
        }
      })
      console.log(friendsList)
      pendingFriendIds.push(user.id)
      pendingFriendIds.forEach(id=> {
        io.to(id).emit('updated_pending_friends', friendsList)
      })
    }
  } catch (error) {
    console.error(error)
  }
}
export function friendsHandler(io: any, socket: any) {
  socket.on('get_friends', (id: string) => {
    socket.join(id)
    friendsListUpdater(socket, id, io)
  })
  socket.on('get_pending_friends', (id: string) => pendingFriendsListUpdater(socket, id, io))
}
