import type { Participant } from "../types/count";

export const getParticipantNames = (participants: Participant[]) =>
  participants.map((p) => p.name);
