import type { Count } from "../types/count";

export const getParticipantNames = (count: Count) =>
  count.participants.map((p) => p.name);
