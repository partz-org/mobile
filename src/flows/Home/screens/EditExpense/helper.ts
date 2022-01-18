import { ExpenseFormState } from "../CreateExpense/expenseFormReducer";
import type { Expense } from "../../../../types/expense";

export const generateInitialState = (expense?: Expense): ExpenseFormState => ({
  amount: expense?.amount.toString() || "0",
  customOwers: expense?.customOwers || [],
  customPayers: expense?.customPayers || [],
  description: expense?.description || "",
  owers: expense?.owers || [],
  payers: expense?.payers || [],
  title: expense?.title || "",
});
