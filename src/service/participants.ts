import { Participant } from "~/types/count";
import { baseUri, mutateData } from "./helper";

const PARTICIPANTS = "participants";

export const deleteParticipant = async (id: string) =>
  mutateData<{ message: string }>(
    `${baseUri}/${PARTICIPANTS}/${id}`,
    {},
    "DELETE"
  );

export const updateParticipant = async ({
  participantId,
  userId,
}: {
  participantId: string;
  userId: string;
}) =>
  mutateData<Participant>(
    `${baseUri}/${PARTICIPANTS}/${participantId}`,
    { user: userId },
    "PUT"
  );
