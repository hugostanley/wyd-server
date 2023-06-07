import { Response, Request } from "express";
import { UserModel, User } from '../models/index.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function createNewUser(req: Request, res: Response) {
  try {
    const userInfo: User = req.body
    console.log(userInfo)

    const takenUserName = await UserModel.findOne({ username: userInfo.username })
    const takenEmail = await UserModel.findOne({ email: userInfo.email })

    if (takenUserName || takenEmail) {
      throw { status: 422, message: 'Username or email has already been taken' }

    } else {
      const hashedPassword = await bcrypt.hash(userInfo.password, 10)
      const newUser = await new UserModel({ ...userInfo, password: hashedPassword }).save()
      res.status(200).json({ message: "User registered", user: newUser })
    }


  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || error
    })
    console.error(error)
  }
}

export async function signInUser(req: Request, res: Response) {
  try {
    const userInfo: Pick<User, "email" | "password"> = req.body
    const userLoggingIn = await UserModel.findOne({ email: userInfo.email })

    if (!userLoggingIn) {
      throw { status: 404, message: "User not found" }
    }

    const match = await bcrypt.compare(userInfo.password, userLoggingIn.password)

    if (match && process.env.JWT_SECRET) {
      const payload = {
        id: userLoggingIn._id,
        username: userLoggingIn.username
      }

      jwt.sign(payload, process.env.JWT_SECRET,
        { expiresIn: 86400 }, (error, token) => {
          if (error) throw { status: 422, message: error }
          res.status(200).json({
            message: 'Logged in successfully',
            token: 'Bearer ' + token,
            user: userLoggingIn
          })
        })
    } else {
      throw { status: 404, message: 'Incorrect password' }
    }
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || error
    })
    console.error(error)

  }
}

export async function getUserDetails(req: Request, res: Response) {
  try {
    const currentUser = await UserModel.findById(req.body.user.id, ['id', 'username', 'email'])
    res.status(200).json({ message: "Success", user: currentUser })
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || error
    })
    console.error(error)
  }
}


export async function getAllUsers(req: Request, res: Response) {
  try {
    const userId = req.body.user.id
    const users = await UserModel.find({ _id: { $ne: userId } })
    res.status(200).json({ message: "success", users })
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || error
    })
    console.error(error)
  }
}
