import { Router } from "express";
import { sendFriendRequest, getAllAcceptedFriends, getAllRequestedFriends, getAllIncomingFriendRequest, acceptFriendRequest } from '../controllers/index.js'
import { authenticateUser } from '../middlewares/index.js'

export const friendshipRouter: Router = Router()

friendshipRouter.post("/friend/add", authenticateUser, sendFriendRequest)
friendshipRouter.post("/friend/accept", authenticateUser, acceptFriendRequest)
friendshipRouter.get("/friends", authenticateUser, getAllAcceptedFriends)
friendshipRouter.get("/friend/requests", authenticateUser, getAllRequestedFriends)
friendshipRouter.get("/friend/incoming", authenticateUser, getAllIncomingFriendRequest)
