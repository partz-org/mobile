import React, { FC, useEffect, useReducer, useState } from "react";
import { Platform, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  Loader,
  ErrorView,
  ExpenseForm,
  BottomContainer,
  Button,
} from "../../../../components";
import { useNotif, useUser } from "../../../../context";
import { getCurrentParticipantName } from "../../../../helpers";
import {
  COUNTS,
  deleteExpense,
  getExpenseById,
  handleError,
  updateExpense,
} from "../../../../service";
import { colors, commonStyles } from "../../../../theme";
import {
  cannotSubmitExpense,
  ExpenseActionField,
  expenseFormReducer,
  ExpenseInput,
  initialExpenseState,
} from "../CreateExpense/expenseFormReducer";
import { generateInitialState } from "./helper";

import type { Expense } from "../../../../types/expense";
import type { EditExpenseRoute, CountListNavigation } from "../../types";
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

  const updateExpenseMutation = useMutation(
    ({ newExpense }: { newExpense: ExpenseInput }) =>
      updateExpense(expenseId, newExpense),
    {
      onError: handleError,
      onSuccess: async () => {
        sendNotif({
          message: "Your expense was updated!",
        });
        await refetchExpense();
        await QC.refetchQueries(currentExpense?.count.id);
        await QC.refetchQueries(COUNTS);
      },
    }
  );
  const deleteExpenseMutation = useMutation(() => deleteExpense(expenseId), {
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
            onPress={() => {
              deleteExpenseMutation.mutate();
            }}
            title="Delete expense"
            type="danger"
          />
        </View>
      </BottomContainer>
    </>
  );
};

export default EditExpense;
