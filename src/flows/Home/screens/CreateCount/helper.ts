import { capitalizeWord } from "../../../../helpers/capitalizeWord";

export type ParticipantInput = { name: string };
export interface CountFormState {
  title: string;
  description: string;
  name: string;
}

export interface CountInput extends Partial<CountFormState> {
  participantsToAdd?: string[];
  participantToRemove?: string;
  participants?: ParticipantInput[];
  currency?: string;
  creatorId?: string;
  userToTag?: string;
}

export const initialCountState: CountFormState = {
  description: "",
  name: "",
  title: "",
};

export const countFormReducer = (
  state = initialCountState,
  { field, payload }: { field: string; payload: string },
) => {
  if (payload) return { ...state, [field]: capitalizeWord(payload) };
  return { ...state, [field]: payload };
};
