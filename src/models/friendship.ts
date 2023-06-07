import { Schema, model, Document } from "mongoose";
const ObjectId = Schema.Types.ObjectId

export interface Friendship extends Document {
  requester: string,
  recipient: string,
  status: "pending" | "friends"
}

const friendshipSchema: Schema = new Schema({
  requester: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  recipient: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: [
      "pending",
      "friends",
    ]
  }

}, {
  timestamps: true
})

export const FriendshipModel = model<Friendship>("Friendship", friendshipSchema)
