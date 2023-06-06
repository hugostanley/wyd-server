import { Response, Request, NextFunction } from "express";
import jwt from 'jsonwebtoken'
export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  if (req.headers.authorization) {
    const token = req.headers["authorization"].split(" ")[1]
    const secret = process.env.JWT_SECRET

    if (token && secret) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(404).json({
          isLoggedIn: false,
          message: "Failed to authenticate"
        })

        req.body['user'] = { ...decoded as Object }
        next()
      })

    } else {
      return res.status(404).json({ message: "Incorrect token given", isLoggedIn: false })
    }
  } else {
    return res.status(400).json({ message: "Authorization headers not found", isLoggedIn: false })
  }
}

