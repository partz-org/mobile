import { ExpenseInput } from "~/flows/Home/screens/CreateExpense/expenseFormReducer";
import { Expense } from "~/types/expense";
import { getData, baseUri, mutateData } from "./helper";

const EXPENSES = "expenses";

export const getExpenseById = async (id: string) =>
  getData<Expense>(`${baseUri}/${EXPENSES}/${id}`);

export const createExpense = async (body: ExpenseInput) =>
  mutateData<Expense>(`${baseUri}/${EXPENSES}`, body, "POST");

export const updateExpense = async ({
  expenseId,
  newExpense,
}: {
  expenseId: string;
  newExpense: ExpenseInput;
}) =>
  mutateData<Expense>(`${baseUri}/${EXPENSES}/${expenseId}`, newExpense, "PUT");

export const deleteExpense = async (id: string) =>
  mutateData<{ message: string }>(`${baseUri}/${EXPENSES}/${id}`, {}, "DELETE");
