import { Request, Response } from "express";
import { FriendshipModel, UserModel } from '../models/index.js'

export async function sendFriendRequest(req: Request, res: Response) {
  try {
    const userLoggedIn = await UserModel.findById(req.body.user.id)
    if (userLoggedIn) {
      const recipient = await UserModel.findById(req.body._id)
      if (recipient) {
        const friendship = await new FriendshipModel({
          recipient,
          requester: userLoggedIn,
          status: "pending"
        }).save()
        await UserModel.findOneAndUpdate({ _id: userLoggedIn }, {
          $push: { friends: friendship._id }
        })

        await UserModel.findOneAndUpdate({ _id: recipient }, {
          $push: { friends: friendship._id }
        })
      }

      res.status(200).json({
        message: "Successful"
      })
    }
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || error
    })
    console.error(error)
  }
}

export async function acceptFriendRequest(req: Request, res: Response) {
  try {
    const userLoggedIn = await UserModel.findById(req.body.user.id)
    const requester = req.body.requester

    if (userLoggedIn) {
      const friendship = await FriendshipModel.findOne({ recipient: userLoggedIn._id, requester })
      if (friendship) {
        friendship.status = "friends"
        await friendship.save()
        res.status(200).json({ message: "Successful" })
      }
    }

  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || error
    })
    console.error(error)
  }
}

export async function getAllAcceptedFriends(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.body.user.id).populate({
      path: 'friends', populate: {
        path: 'requester recipient',
        model: 'User'
      }
    }).exec()

    if (user) {
      // @ts-ignore
      const friendsList = user.friends.filter(item => item.status === "friends")
      res.status(200).json({ message: "success", friends: friendsList })
    }
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || error
    })
    console.error(error)
  }
}

export async function getAllIncomingFriendRequest(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.body.user.id).populate({
      path: 'friends', populate: {
        path: 'requester',
        model: 'User'
      }
    }).exec()
    if (user) {
      // @ts-ignore
      const friendsList = user.friends.filter(item => item.status === "pending" && item.recipient._id.toString() === user._id.toString())
      res.status(200).json({ message: "success", friendRequest: friendsList })
    }
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || error
    })
    console.error(error)
  }
}

export async function getAllRequestedFriends(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.body.user.id).populate({
      path: 'friends', populate: {
        path: 'recipient',
        model: 'User'
      }
    }).exec()
    if (user) {
      // @ts-ignore
      const friendsList = user.friends.filter(item => item.status === "pending" && item.requester._id.toString() === user._id.toString())
      res.status(200).json({ message: "success", requestedFriends: friendsList })
    }
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || error
    })
    console.error(error)
  }
}


