import { baseUri, getData, mutateData } from "./helper";

import type { User } from "../types/user";

const USERS = "users";
const REGISTER = "register";

export interface UserInput {
  email?: string;
  name?: string;
  password?: string;
  phoneNumber?: string;
  expoToken?: string;
}

export interface TempUserInput {
  expoToken: string;
}

export const getUserById = async (id: string) =>
  getData<User>(`${baseUri}/${USERS}/${id}`);

export const createTempUser = async (body?: TempUserInput) =>
  mutateData<User>(`${baseUri}/${USERS}`, body, "POST");

export const registerUser = async (body: UserInput) =>
  mutateData<User>(`${baseUri}/${USERS}/${REGISTER}`, body, "POST");

export const updateUser = async (id: string, body: UserInput) =>
  mutateData<User>(`${baseUri}/${USERS}/${id}`, body, "PUT");
