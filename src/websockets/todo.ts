import { Server, Socket } from "socket.io"
import { Todo } from "../models/index.js"

type FeedClientEventType = "new" | "edit" | "delete"

interface FeedUpdaterProps {
  socket?: Socket;
  feedIds: string[]
  io: Server;
  todo: Todo
  type: FeedClientEventType
}

async function feedUpdater({ feedIds, io, todo, type }: FeedUpdaterProps) {
  if (!feedIds) return
  feedIds.forEach(id => {
    io.to(id).emit('feed_updated', { type, todo })
  })
}
export function todoHandler(io: Server, socket: Socket) {
  socket.on('join_room', (id) => {
    socket.join(id)
  })

  socket.on('get_feed', ({ feedIds, todo, type }: { id: string, feedIds: string[], todo: Todo, type: FeedClientEventType }) => {
    feedUpdater({ socket, feedIds, io, todo, type })
  })
}

