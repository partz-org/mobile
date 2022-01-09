import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import type { Participant } from "../../types/count";

export type HomeStackParamList = {
  CountBalances: { countId: string };
  ExpenseList: { countId: string; countTitle: string; countTotal: number };
  CreateCount: undefined;
  CountList: undefined;
  JoinCount: {
    countId: string;
    participants: Participant[];
    countTitle: string;
    countTotal: number;
  };
  EditCount: { countId: string; countTitle: string };
  CreateExpense: { countId: string };
  EditExpense: {
    expenseId: string;
    expenseTitle: string;
  };
};

export type CountNavigation = StackNavigationProp<
  HomeStackParamList,
  "CreateCount"
>;

export type CountBalancesRoute = RouteProp<HomeStackParamList, "CountBalances">;
export type CountBalancesNavigation = StackNavigationProp<
  HomeStackParamList,
  "CountBalances"
>;

export type ExpenseListRoute = RouteProp<HomeStackParamList, "ExpenseList">;
export type ExpenseListNavigation = StackNavigationProp<
  HomeStackParamList,
  "ExpenseList"
>;

export type CreateExpenseRoute = RouteProp<HomeStackParamList, "CreateExpense">;

export type EditCountRoute = RouteProp<HomeStackParamList, "EditCount">;
export type EditCountNavigation = StackNavigationProp<
  HomeStackParamList,
  "EditCount"
>;

export type EditExpenseRoute = RouteProp<HomeStackParamList, "EditExpense">;

export type CountListNavigation = StackNavigationProp<HomeStackParamList>;

export type JoinCountRoute = RouteProp<HomeStackParamList, "JoinCount">;
export type JoinCountNavigation = StackNavigationProp<
  HomeStackParamList,
  "JoinCount"
>;
