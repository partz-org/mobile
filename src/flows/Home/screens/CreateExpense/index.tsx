import React, { FC, useReducer, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Platform, StyleSheet } from "react-native";
import {
  BottomContainer,
  Button,
  ErrorView,
  ExpenseForm,
  Loader,
} from "~/components";
import { useUser, useNotif } from "~/context";
import { getCurrentParticipantName } from "~/helpers";
import { createExpense, handleError, COUNTS } from "~/service";
import { colors } from "~/theme";
import { useQueryCountById } from "../../hooks";
import { CreateExpenseRoute, CountListNavigation } from "../../types";
import {
  expenseFormReducer,
  initialExpenseState,
  cannotSubmitExpense,
  ExpenseActionField,
} from "./expenseFormReducer";

interface CreateExpenseProps {
  route: CreateExpenseRoute;
  navigation: CountListNavigation;
}

const CreateExpense: FC<CreateExpenseProps> = ({ route, navigation }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const {
    data: currentCount,
    isLoading,
    error,
  } = useQueryCountById(route.params.countId);

  const { user: userContext } = useUser();

  const QC = useQueryClient();

  const { sendNotif } = useNotif();

  const createExpenseMutation = useMutation(createExpense, {
    onError: handleError,
    onSuccess: async () => {
      await QC.refetchQueries(route.params.countId);
      await QC.refetchQueries(COUNTS);

      sendNotif({
        message: "Your expense was created.",
      });
      navigation.goBack();
    },
  });

  const [expenseFormState, dispatchFormState] = useReducer(
    expenseFormReducer,
    initialExpenseState
  );
  if (isLoading) return <Loader />;

  if (!currentCount || error) return <ErrorView />;

  const cannotSubmit = cannotSubmitExpense(expenseFormState);

  const onChangeDate = (event: Event, selectedDate: Date | undefined) => {
    setShowDatePicker(Platform.OS === "ios");
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const onChange = (value: string, name: ExpenseActionField) => {
    dispatchFormState({ field: name, payload: value, type: "input" });
  };

  const onSubmit = () => {
    createExpenseMutation.mutate({
      ...expenseFormState,
      count: route.params.countId,
    });
  };

  return (
    <>
      <ExpenseForm
        currentCount={currentCount}
        date={date}
        dispatchFormState={dispatchFormState}
        expenseFormState={expenseFormState}
        onChange={onChange}
        onChangeDate={onChangeDate}
        setShowDatePicker={setShowDatePicker}
        showDatePicker={showDatePicker}
      />

      <BottomContainer style={styles.bottomContainer}>
        <Button
          disabled={createExpenseMutation.isLoading || cannotSubmit}
          icon="check"
          iconColor={colors.primary}
          onPress={onSubmit}
          title="Create your expense"
          style={styles.bottomButton}
        />
      </BottomContainer>
    </>
  );
};

const styles = StyleSheet.create({
  bottomButton: { flex: 0 },
  bottomContainer: { justifyContent: "center" },
});
export default CreateExpense;
