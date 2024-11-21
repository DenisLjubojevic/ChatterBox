import {Users} from "./Users";

export interface ChatRoom{
  id: number;
  name: string;
  type: string;
  description: string;
  createdDate: string;
  lastMessageTimestamp: string;
  members: Users[];
  createdBy: Users;
  isMuted: boolean;
  isPinned: boolean;
  pictureUrl: string;
}
