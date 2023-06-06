import { Router } from "express";
import { createNewUser, signInUser, getUserDetails } from '../controllers/index.js'
import { authenticateUser } from "../middlewares/auth.js";

export const userRouter: Router = Router()

userRouter.post("/user/new", createNewUser)
userRouter.post("/user/signin", signInUser)
userRouter.get("/user", authenticateUser, getUserDetails)

