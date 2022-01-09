import type { Participant } from "../types/count";
import type { User } from "../types/user";

export const getCurrentParticipantName = (
  participants: Participant[],
  user: User
) =>
  participants.find((participant) => participant.user === user.id)?.name || "";
