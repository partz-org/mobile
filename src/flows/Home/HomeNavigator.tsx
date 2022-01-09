import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../../theme/colors";
import CreateCount from "./screens/CreateCount";
import JoinCount from "./screens/JoinCount";
import EditCount from "./screens/EditCount";
import EditCountIcon from "./EditCountIcon";
import { HomeStackParamList } from "./types";
import CreateExpense from "./screens/CreateExpense";
import EditExpense from "./screens/EditExpense";
import CountBalances from "./screens/CountBalances";
import CountList from "./screens/CountList";
import ExpenseList from "./screens/ExpenseList";

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator = ({}) => (
  <Stack.Navigator
    initialRouteName="CountList"
    screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: colors.lighter },
      headerTitleAlign: "center",
    }}
  >
    <Stack.Screen name="CountList" component={CountList} />
    <Stack.Screen
      name="CreateCount"
      component={CreateCount}
      options={{
        headerShown: true,
        headerTitle: "Enter your count's details",
      }}
    />
    <Stack.Screen
      name="CountBalances"
      component={CountBalances}
      options={{
        headerShown: true,
        headerTitle: "Count Balances",
      }}
    />
    <Stack.Screen
      name="CreateExpense"
      component={CreateExpense}
      options={{
        headerShown: true,
        headerTitle: "Enter your expense's details",
      }}
    />
    <Stack.Screen
      name="ExpenseList"
      component={ExpenseList}
      options={({ route }) => {
        return {
          headerRight: () => (
            <EditCountIcon
              countId={route.params.countId}
              countTitle={route.params.countTitle}
            />
          ),
          headerShown: true,
          headerTitle: route.params.countTitle,
        };
      }}
    />
    <Stack.Screen
      name="EditCount"
      component={EditCount}
      options={({ route }) => ({
        headerShown: true,
        headerTitle: `Edit count ${route.params.countTitle}`,
      })}
    />
    <Stack.Screen
      name="EditExpense"
      component={EditExpense}
      options={({ route }) => ({
        headerShown: true,
        headerTitle: `Edit expense ${route.params.expenseTitle}`,
      })}
    />
    <Stack.Screen
      name="JoinCount"
      component={JoinCount}
      options={{
        headerShown: true,
        headerTitle: "Which participant are you?",
      }}
    />
  </Stack.Navigator>
);

export default HomeNavigator;
