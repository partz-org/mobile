import React, { Dispatch, FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ExpenseAction } from "../flows/Home/screens/CreateExpense/expenseFormReducer";
import { colors } from "../theme/colors";
import Input from "./Input";

interface CustomExpenseInputProps {
  field: "customOwers" | "customPayers";
  name: string;
  value: number;
  dispatchFormState: Dispatch<ExpenseAction>;
}

const CustomExpenseInput: FC<CustomExpenseInputProps> = ({
  field,
  name,
  dispatchFormState,
  value,
}) => {
  const [amount, setAmount] = useState<string>("0");
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Input
        placeholder={"Enter a custom amount"}
        placeholderTextColor={colors.primary}
        keyboardType="numeric"
        defaultValue={"0"}
        onChangeText={e => {
          if (e === "0") {
            setAmount("");
          } else {
            setAmount(e);
          }
        }}
        onEndEditing={() => {
          dispatchFormState({
            field,
            payload: {
              customAmount: Number(amount),
              isCustom: true,
              name,
            },
            type: "custom",
          });
          setAmount("0");
        }}
        value={amount === "0" ? value.toFixed(2) : amount}
        maxLength={22}
      />
    </View>
  );
};

export default CustomExpenseInput;

const styles = StyleSheet.create({
  container: { marginHorizontal: 20 },
  name: { fontSize: 20 },
});
