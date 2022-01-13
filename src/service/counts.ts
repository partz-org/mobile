import { CountInput } from "../flows/Home/screens/CreateCount/helper";
import { baseUri, getData, mutateData } from "./helper";

import type { Count } from "../types/count";

export const COUNTS = "counts";

export const getCounts = async () =>
  getData<Count>(`${baseUri}/${COUNTS}/?all=true`);

export const getUserCounts = async () =>
  getData<Count[]>(`${baseUri}/${COUNTS}/me`);

export const getCountById = async (id: string) =>
  getData<Count>(`${baseUri}/${COUNTS}/${id}`);

export const createCount = async (body: CountInput) =>
  mutateData<Count>(`${baseUri}/${COUNTS}`, body, "POST");

export const updateCount = async (id: string, body: CountInput) =>
  mutateData<Count>(`${baseUri}/${COUNTS}/${id}`, body, "PUT");

export const deleteCount = async (id: string) =>
  mutateData<{ message: string }>(`${baseUri}/${COUNTS}/${id}`, {}, "DELETE");
