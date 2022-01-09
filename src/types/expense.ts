import { ExpenseParticipant } from "../flows/Home/screens/CreateExpense/expenseFormReducer";
import { Count } from "./count";

export interface Expense {
  amount: number;
  count: Count;
  createdAt: string;
  customOwers: ExpenseParticipant[];
  customPayers: ExpenseParticipant[];
  currency: "EUR" | "USD" | "CAD";
  description: string;
  id: string;
  payers: string[];
  owers: string[];
  title: string;
  updatedAt: string;
}
