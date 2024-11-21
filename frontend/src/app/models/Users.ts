export interface Users{
  id: number;
  name: string;
  pass: string;
  email: string;
  displayedName: string;
  pfpUrl: string;
  isOnline: boolean;
  lastSeen: string;
  role: string;
  friends: Users[];
}
