import { Document } from "mongoose";
import { Schema, model } from "mongoose";
const ObjectId = Schema.Types.ObjectId

export interface Todo extends Document {
  title: string;
  description: string;
  createdByUser: string
  status: "inprogress" | "finished"
}
const todoSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["inprogress", "finished"]
  },
  description: String,
  createdByUser: {
    type: ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
})

export const TodoModel = model<Todo>("Todo", todoSchema)
