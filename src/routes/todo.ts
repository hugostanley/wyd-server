import { Router } from "express";
import { addNewTodo } from '../controllers/index.js'
import { authenticateUser } from "../middlewares/index.js"

export const todoRouter: Router = Router()
todoRouter.post("/todo/new", authenticateUser, addNewTodo)
