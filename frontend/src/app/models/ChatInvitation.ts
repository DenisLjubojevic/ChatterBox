import {Users} from "./Users";
import {ChatRoom} from "./ChatRoom";

export interface ChatInvitation{
  id :number;
  sender :Users;
  recipient :Users;
  chat :ChatRoom;
  status :string;
  createdDate :string;
}
