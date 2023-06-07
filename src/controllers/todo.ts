import { Response, Request } from "express";
import { Todo, TodoModel, UserModel } from '../models/index.js'

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

      await new TodoModel({ ...body, createdByUser: user._id }).save()
      res.status(200).json({ message: 'success' })
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
      await TodoModel.findByIdAndUpdate(newBody._id, { description: newBody.description, title: newBody.title })

      res.status(200).json({ message: "Successful" })
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
      await TodoModel.findByIdAndDelete(id)
      res.status(200).json({ message: "Successful" })
    }
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || error
    })
    console.error(error)

  }
}
