import { PopulatedFriendship } from '../controllers/todo.js';
import { Todo } from '../models/todo.js';
type FeedEventType = "new" | "edit" | "delete"
export interface ServerToClientEvents {
  feed_updated: ({ type, todo }: { type: FeedEventType, todo: Todo }) => void;
  friends_updated: (friendsList: PopulatedFriendship) => void;
  updated_pending_friends: (friendsList: PopulatedFriendship) => void;
}

export interface ClientToServerEvents {
  join_room: (id: string) => void;
  get_feed: ({ id, feedIds, todo, type }: { id: string, feedIds: string[], todo: Todo, type: FeedEventType }) => void;
  get_friends: (id: string) => void;
  get_pending_friends: (id: string) => void

}
export * from './todo.js'
export * from './friends.js'
