import { Response, Request } from "express";
import { Friendship, Todo, TodoModel, User, UserModel } from '../models/index.js'

export interface PopulatedFriendship extends Omit<Friendship, "requester" | "recipient"> {
  requester: User;
  recipient: User;
}

export async function addNewTodo(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.body.user.id)
    if (user) {
      const body = req.body as Pick<Todo, "description" | "title" | "status">
      const arr = ["description", "status", "title"]
      arr.forEach(item => {
        if (!Object.keys(body).includes(item)) {
          throw `Incorrect body`
        }
      })

      const newTodo = await new TodoModel({ ...body, createdByUser: user._id }).save()
      await newTodo.populate('createdByUser')
      res.status(200).json({ message: 'success', newTodo })
    } else {
      throw { status: 404, message: 'user not found' }
    }

  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || error
    })
    console.error(error)

  }
}

export async function editTodo(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.body.user.id)
    if (user) {
      const newBody = req.body
      const arr = ["description", "title", "_id"]
      arr.forEach(item => {
        if (!Object.keys(newBody).includes(item)) {
          throw 'Incorrect body'
        }
      })
      const updatedTodo = await TodoModel.findByIdAndUpdate(newBody._id, { description: newBody.description, title: newBody.title }, { new: true })
      if (updatedTodo) {
        await updatedTodo.populate('createdByUser')
      }

      res.status(200).json({ message: "Successful", updatedTodo })
    }
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || error
    })
    console.error(error)

  }
}

export async function deleteTodo(req: Request, res: Response) {
  try {
    const user = await UserModel.findById(req.body.user.id)
    if (user) {
      const id = req.body._id
      const deletedTodo = await TodoModel.findByIdAndDelete(id)
      res.status(200).json({ message: "Successful", deletedTodo })
    }
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || error
    })
    console.error(error)

  }
}

export async function getFeed(req: Request, res: Response) {
  try {
    const currentUser = await UserModel.findById(req.body.user.id).populate<{ friends: PopulatedFriendship[] }>({
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
      const taskList = await TodoModel.find({ createdByUser: { $in: [...friendIdArr, currentUser.id] } }).populate('createdByUser')
      friendIdArr.push(currentUser.id)
      res.status(200).json({ message: "Successful", list: taskList, friendIdArr })
    }
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || error
    })
    console.error(error)

  }
}
