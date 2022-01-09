import { Expense } from "./expense";

export interface Count {
  currency: string;
  total: number;
  expenses: Expense[];
  title: string;
  description: string;
  participants: Participant[];
  chosenParticipant: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface Participant {
  balance: number;
  credit: number;
  debit: number;
  debtors: DebtorsOrCreditors[];
  creditors: DebtorsOrCreditors[];
  id: string;
  user: string;
  name: string;
}

interface DebtorsOrCreditors {
  _id: string;
  name: string;
  amount: number;
}
