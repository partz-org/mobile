export interface ExpenseFormState {
  [key: string]: any;
  amount: string;
  description: string;
  mutatedBy: string;
  payers: string[];
  owers: string[];
  customOwers: ExpenseParticipant[];
  customPayers: ExpenseParticipant[];
  title: string;
}

export interface ExpenseParticipant {
  name: string;
  isCustom: boolean;
  customAmount?: number;
}

export interface ExpenseInput extends Partial<ExpenseFormState> {
  count?: string;
  currency?: string;
  mutatedBy: string;
  payers: string[];
  owers: string[];
  customOwers: ExpenseParticipant[];
  customPayers: ExpenseParticipant[];
}

export const initialExpenseState: ExpenseFormState = {
  amount: "",
  customOwers: [],
  customPayers: [],
  description: "",
  mutatedBy: "",
  owers: [],
  payers: [],
  title: "",
};

export type ExpenseActionField =
  | "title"
  | "description"
  | "amount"
  | "payers"
  | "customOwers"
  | "customPayers"
  | "owers";

export type ExpenseAction =
  | {
      type: "input";
      field: string;
      payload: string;
    }
  | {
      type: "fill";
      field: "payers" | "owers";
      payload: string[];
    }
  | {
      type: "remove" | "add";
      field: "payers" | "owers";
      payload: string;
    }
  | {
      type: "reset";
      field: "payers" | "owers";
    }
  | {
      type: "custom";
      field: "customPayers" | "customOwers";
      payload: ExpenseParticipant;
    }
  | {
      type: "state";
      payload: ExpenseFormState;
    };

export const expenseFormReducer = (
  state = initialExpenseState,
  action: ExpenseAction
) => {
  let isPayer;
  let customField: "customPayers" | "customOwers";

  let participantsOfExpense: ExpenseParticipant[];

  let numberOfUncustomUsers: number = 0;

  let totalCustom: number;

  let newTotal: number;

  let updatedparticipantsOfExpense: ExpenseParticipant[];

  switch (action.type) {
    case "add":
      isPayer = action.field === "payers";
      customField = isPayer ? "customPayers" : "customOwers";

      participantsOfExpense = [
        ...state[customField],
        { customAmount: 0, isCustom: false, name: action.payload },
      ];

      totalCustom = participantsOfExpense.reduce((acc, curr) => {
        if (curr.isCustom) {
          return acc + Number(curr.customAmount || 0);
        }
        numberOfUncustomUsers++;
        return acc;
      }, 0);

      newTotal = Number(state.amount) - totalCustom;

      updatedparticipantsOfExpense = participantsOfExpense.map((participant) =>
        participant.isCustom
          ? participant
          : {
              ...participant,
              customAmount: newTotal / numberOfUncustomUsers,
            }
      );

      return {
        ...state,
        [action.field]: [...state[action.field], action.payload],
        [customField]: updatedparticipantsOfExpense,
      };
    case "remove":
      isPayer = action.field === "payers";
      customField = isPayer ? "customPayers" : "customOwers";

      participantsOfExpense = [
        ...state[customField].filter((p) => p.name !== action.payload),
      ];

      totalCustom = participantsOfExpense.reduce((acc, curr) => {
        if (curr.isCustom) {
          return acc + Number(curr.customAmount || 0);
        }
        numberOfUncustomUsers++;
        return acc;
      }, 0);

      newTotal = Number(state.amount) - totalCustom;

      updatedparticipantsOfExpense = participantsOfExpense.map((participant) =>
        participant.isCustom
          ? participant
          : {
              ...participant,
              customAmount: newTotal / numberOfUncustomUsers,
            }
      );

      return {
        ...state,
        [action.field]: [
          ...state[action.field].filter((p) => p !== action.payload),
        ],
        [customField]: updatedparticipantsOfExpense,
      };

    case "fill":
      isPayer = action.field === "payers";
      customField = isPayer ? "customPayers" : "customOwers";
      return {
        ...state,
        [action.field]: action.payload,
        [customField]: action.payload.map((p) => ({
          customAmount: 0,
          isCustom: false,
          name: p,
        })),
      };

    case "custom":
      participantsOfExpense = state[action.field];

      const customParticipantIndex = participantsOfExpense.findIndex(
        (p) => p.name === action.payload.name
      );
      const isAlreadyCustom = customParticipantIndex !== -1;

      if (isAlreadyCustom) {
        participantsOfExpense[customParticipantIndex] = action.payload;
      } else {
        participantsOfExpense.push(action.payload);
      }

      totalCustom = participantsOfExpense.reduce((acc, curr) => {
        if (curr.isCustom) {
          return acc + Number(curr.customAmount || 0);
        }
        numberOfUncustomUsers++;
        return acc;
      }, 0);

      newTotal = Number(state.amount) - totalCustom;

      updatedparticipantsOfExpense = participantsOfExpense.map((participant) =>
        participant.isCustom
          ? participant
          : {
              ...participant,
              customAmount: newTotal / numberOfUncustomUsers,
            }
      );

      return {
        ...state,
        [action.field]: updatedparticipantsOfExpense,
      };

    case "reset":
      if (action.field === "payers") {
        return {
          ...state,
          customPayers: [],
          payers: [],
        };
      } else {
        return {
          ...state,
          customOwers: [],
          owers: [],
        };
      }
    case "state":
      return { ...action.payload };
    default:
      return { ...state, [action.field]: action.payload };
  }
};

export const cannotSubmitExpense = (state: ExpenseFormState) =>
  state.title.length < 2 ||
  parseFloat(state.amount) <= 0 ||
  state.payers.length < 1 ||
  state.owers.length < 1;
