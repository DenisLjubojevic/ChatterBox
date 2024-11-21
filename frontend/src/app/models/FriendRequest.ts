import {Users} from "./Users";

export interface FriendRequest{
  id: number;
  sender: Users;
  recipient: Users;
  status: string;
  createdDate: string;
}
