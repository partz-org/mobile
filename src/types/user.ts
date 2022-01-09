import { Count } from "./count";

export interface User {
  name: string;
  role: string;
  email?: string;
  counts: Count[];
  createdAt: string;
  updatedAt: string;
  phoneNumber: string;
  isLoggedIn: boolean;
  __v: number;
  token?: string;
  id: string;
}
