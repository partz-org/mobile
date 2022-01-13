import { Count } from "./count";

export interface User {
  name: string;
  role: string;
  email?: string;
  counts: Count[];
  createdAt: string;
  updatedAt: string;
  phoneNumber: string;
  token: string;
  id: string;
  __v: number;
}
