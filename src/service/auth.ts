import { baseUri, mutateData } from "./helper";
import type { User } from "../types/user";

const LOGIN = "login";

export interface LoginPayload {
  phoneNumber: string;
}

export const login = async (body: LoginPayload) =>
  mutateData<User>(`${baseUri}/${LOGIN}`, body, "POST");

const LOGOUT = "logout";

export const logout = async (body = {}) =>
  mutateData<User>(`${baseUri}/${LOGOUT}`, body, "POST");
