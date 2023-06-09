import { Router } from "express";
import { addNewTodo, deleteTodo, editTodo, getFeed } from '../controllers/index.js'
import { authenticateUser } from "../middlewares/index.js"

export const todoRouter: Router = Router()
todoRouter.post("/todo/new", authenticateUser, addNewTodo)
todoRouter.post("/todo/edit", authenticateUser, editTodo)
todoRouter.post("/todo/delete", authenticateUser, deleteTodo)
todoRouter.get("/todo/feed", authenticateUser, getFeed)
