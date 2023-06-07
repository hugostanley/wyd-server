import { Router } from "express";
import { createNewUser, getAllUsers, signInUser, getUserDetails } from '../controllers/index.js'
import { authenticateUser } from "../middlewares/auth.js";

export const userRouter: Router = Router()

userRouter.post("/user/new", createNewUser)
userRouter.post("/user/signin", signInUser)
userRouter.get("/users", authenticateUser, getAllUsers)
userRouter.get("/user", authenticateUser, getUserDetails)

