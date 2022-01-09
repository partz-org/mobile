import { ExpenseInput } from "../flows/Home/screens/CreateExpense/expenseFormReducer";
import { baseUri, getData, mutateData } from "./helper";

import type { Expense } from "../types/expense";

const EXPENSES = "expenses";

export const getExpenseById = async (id: string) =>
  getData<Expense>(`${baseUri}/${EXPENSES}/${id}`);

export const createExpense = async (body: ExpenseInput) =>
  mutateData<Expense>(`${baseUri}/${EXPENSES}`, body, "POST");

export const updateExpense = async (id: string, body: ExpenseInput) =>
  mutateData<Expense>(`${baseUri}/${EXPENSES}/${id}`, body, "PUT");

export const deleteExpense = async <T>(id: string) =>
  mutateData<{ message: string }>(`${baseUri}/${EXPENSES}/${id}`, {}, "DELETE");
