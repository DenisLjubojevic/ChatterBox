import {Users} from "./Users";
import {ChatRoom} from "./ChatRoom";

export interface Message{
  id: number;
  content: string;
  timestamp: string;
  user: Users;
  chatRoom: ChatRoom;
}
