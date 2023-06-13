async function feedUpdater({ socket, feedIds, io, todo, type }) {
  if (!feedIds) return
  feedIds.forEach(id => {
    io.to(id).emit('feed_updated', { type, todo })
  })
}
export function todoHandler(io: any, socket: any) {
  socket.on('join_room', (id) => {
    socket.join(id)
  })

  socket.on('get_feed', ({ id, feedIds, todo, type }: { id: stirng, feedIds: string[] }) => {
    feedUpdater({ socket, feedIds, io, todo, type })
  })
}

