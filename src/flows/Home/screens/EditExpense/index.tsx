import React, { FC, useEffect, useReducer, useState } from "react";
import { Platform, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  BottomContainer,
  Button,
  ErrorView,
  ExpenseForm,
  Loader,
} from "~/components";
import { useUser, useNotif } from "~/context";
import { getCurrentParticipantName } from "~/helpers";
import {
  getExpenseById,
  updateExpense,
  handleError,
  COUNTS,
  deleteExpense,
} from "~/service";
import { commonStyles, colors } from "~/theme";
import { Expense } from "~/types/expense";
import { EditExpenseRoute, CountListNavigation } from "../../types";
import {
  expenseFormReducer,
  initialExpenseState,
  cannotSubmitExpense,
  ExpenseActionField,
} from "../CreateExpense/expenseFormReducer";
import { generateInitialState } from "./helper";
interface EditExpenseProps {
  route: EditExpenseRoute;
  navigation: CountListNavigation;
}

const EditExpense: FC<EditExpenseProps> = ({
  route: {
    params: { expenseId },
  },
  navigation,
}) => {
  const {
    data: currentExpense,
    isFetching: loadingExpense,
    error: errorExpense,
    refetch: refetchExpense,
  } = useQuery<Expense>(expenseId, () => getExpenseById(expenseId));
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [expenseFormState, dispatchFormState] = useReducer(
    expenseFormReducer,
    initialExpenseState
  );

  useEffect(() => {
    dispatchFormState({
      payload: generateInitialState(currentExpense),
      type: "state",
    });
  }, [currentExpense]);

  const cannotSubmit = cannotSubmitExpense(expenseFormState);

  const QC = useQueryClient();

  const { user: userContext } = useUser();

  const { sendNotif } = useNotif();

  const updateExpenseMutation = useMutation(updateExpense, {
    onError: handleError,
    onSuccess: async () => {
      sendNotif({
        message: "Your expense was updated!",
      });
      await refetchExpense();
      await QC.refetchQueries(currentExpense?.count.id);
      await QC.refetchQueries(COUNTS);
    },
  });
  const deleteExpenseMutation = useMutation(deleteExpense, {
    onSuccess: async () => {
      sendNotif({
        level: "danger",
        message: "Your expense was deleted.",
      });
      await QC.refetchQueries(currentExpense?.count.id);
      await QC.refetchQueries(COUNTS);
      navigation.goBack();
    },
  });

  const onChangeDate = (event: Event, selectedDate: Date | undefined) => {
    setShowDatePicker(Platform.OS === "ios");
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const onChange = (value: string, name: ExpenseActionField) => {
    dispatchFormState({ field: name, payload: value, type: "input" });
  };

  if (loadingExpense) return <Loader />;

  if (!currentExpense || errorExpense) return <ErrorView />;

  return (
    <>
      <ExpenseForm
        currentCount={currentExpense.count}
        date={date}
        dispatchFormState={dispatchFormState}
        expenseFormState={expenseFormState}
        isEditing
        onChange={onChange}
        onChangeDate={onChangeDate}
        setShowDatePicker={setShowDatePicker}
        showDatePicker={showDatePicker}
      />

      <BottomContainer>
        <View style={commonStyles.buttonContainer}>
          <Button
            disabled={updateExpenseMutation.isLoading || cannotSubmit}
            icon="check"
            iconColor={colors.primary}
            onPress={() => {
              updateExpenseMutation.mutate({
                expenseId,
                newExpense: {
                  ...expenseFormState,
                  mutatedBy: getCurrentParticipantName(
                    currentExpense.count.participants,
                    userContext
                  ),
                },
              });
            }}
            title="Edit expense"
          />
          <Button
            disabled={deleteExpenseMutation.isLoading}
            icon="delete"
            iconColor={colors.red}
            onPress={() => deleteExpenseMutation.mutate(expenseId)}
            title="Delete expense"
            type="danger"
          />
        </View>
      </BottomContainer>
    </>
  );
};

export default EditExpense;
