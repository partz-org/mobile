import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  BottomContainer,
  Button,
  Container,
  ErrorView,
  ItemList,
  Loader,
} from "../../../../components";
import { useRemoveRouteFromHistory } from "../../../../hooks/useRemoveRouteFromHistory";
import { colors, commonStyles } from "../../../../theme";
import { useQueryCountById } from "../../hooks";

import type { Expense } from "../../../../types/expense";
import type { ExpenseListNavigation, ExpenseListRoute } from "../../types";
interface ExpenseListProps {
  navigation: ExpenseListNavigation;
  route: ExpenseListRoute;
}

const ExpenseList: FC<ExpenseListProps> = ({ route, navigation }) => {
  const {
    data: currentCount,
    isLoading,
    error,
  } = useQueryCountById(route.params.countId);

  useRemoveRouteFromHistory("JoinCount");

  if (isLoading) return <Loader />;

  if (!currentCount || error) return <ErrorView />;

  return (
    <>
      <Container scrollViewMargin={150}>
        <Text
          style={styles.title}
        >{`Total: ${currentCount.total}€ - N° of expenses: ${currentCount.expenses.length}`}</Text>
        {currentCount?.expenses.map((expense: Expense, i: number) => {
          return (
            <ItemList
              createdAt={expense.createdAt}
              secondaryLabel="Paid by:"
              secondaryText={`${expense.payers.join(" ")}`}
              title={expense.title}
              onPress={() =>
                navigation.navigate("EditExpense", {
                  expenseId: expense.id,
                  expenseTitle: expense.title,
                })
              }
              participants={`${expense.owers.join(" ")}`}
              key={i}
              total={expense.amount}
            />
          );
        })}
      </Container>

      <BottomContainer>
        <View style={commonStyles.buttonContainer}>
          <Button
            icon="add-box"
            iconColor={colors.primary}
            onPress={() =>
              navigation.navigate("CreateExpense", {
                countId: currentCount!.id,
              })
            }
            title="Add an expense"
          />
          <Button
            icon="notes"
            iconColor={colors.white}
            onPress={() =>
              navigation.navigate("CountBalances", {
                countId: currentCount!.id,
              })
            }
            title="See balances"
            type="secondary"
          />
        </View>
      </BottomContainer>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    alignSelf: "center",
    color: colors.primary,
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ExpenseList;
