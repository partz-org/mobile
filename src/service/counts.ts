import { CountInput } from "~/flows/Home/screens/CreateCount/helper";
import { Count } from "~/types/count";
import { baseUri, getData, mutateData } from "./helper";

export const COUNTS = "counts";

export const getCounts = async () =>
  getData<Count>(`${baseUri}/${COUNTS}/?all=true`);

export const getUserCounts = async () =>
  getData<Count[]>(`${baseUri}/${COUNTS}/me`);

export const getCountById = async (id: string) =>
  getData<Count>(`${baseUri}/${COUNTS}/${id}`);

export const createCount = async (body: CountInput) =>
  mutateData<Count>(`${baseUri}/${COUNTS}`, body, "POST");

export const updateCount = async ({
  countId,
  newCount,
}: {
  countId: string;
  newCount: CountInput;
}) => mutateData<Count>(`${baseUri}/${COUNTS}/${countId}`, newCount, "PUT");

export const deleteCount = async (id: string) =>
  mutateData<{ message: string }>(`${baseUri}/${COUNTS}/${id}`, {}, "DELETE");
