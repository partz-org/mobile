import { ExpenseParticipant } from "../flows/Home/screens/CreateExpense/expenseFormReducer";

export const isSimilarArrayOfString = (arr1: string[], arr2: string[] = []) =>
  arr1.length === arr2.length && arr1.every(s => arr2.includes(s));

export const isSimilarArrayOfParticipants = (
  arr1: ExpenseParticipant[],
  arr2: ExpenseParticipant[],
) => {
  const arr1Names = arr1.map(a1 => a1.name);

  const arr2Names = arr2.map(a2 => a2.name);
  return isSimilarArrayOfString(arr1Names, arr2Names);
};
