import { baseUri, mutateData } from "./helper";

import type { Participant } from "../types/count";

const PARTICIPANTS = "participants";

export const deleteParticipant = async (id: string) =>
  mutateData<{ message: string }>(
    `${baseUri}/${PARTICIPANTS}/${id}`,
    {},
    "DELETE"
  );

type UpdateParticipantProps = { user: string };

export const updateParticipant = async (
  id: string,
  body: UpdateParticipantProps
) => mutateData<Participant>(`${baseUri}/${PARTICIPANTS}/${id}`, body, "PUT");
