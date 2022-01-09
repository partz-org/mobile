import React, { Dispatch, FC, useMemo, useState } from "react";
import {
  TouchableOpacity,
  Text,
  Platform,
  ScrollView,
  View,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ParticipantCell from "../flows/Home/screens/CreateCount/ParticipantCell";
import { colors } from "../theme/colors";
import Card from "./Card";
import Container from "./Container";
import Button from "./Button";
import BottomDrawer from "./BottomDrawer";
import CustomExpenseInput from "./CustomExpenseInput";
import Input from "./Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ExpenseAction,
  ExpenseActionField,
  ExpenseFormState,
} from "../flows/Home/screens/CreateExpense/expenseFormReducer";
import type { Count } from "../types/count";
import { sortAlphabetically } from "../helpers/sortAlphabetically";
import { getParticipantNames } from "../helpers/getParticipantNames";

interface ExpenseFormProps {
  currentCount: Count;
  date: Date;
  dispatchFormState: Dispatch<ExpenseAction>;
  expenseFormState: ExpenseFormState;
  isEditing?: boolean;
  onChange: (value: string, name: ExpenseActionField) => void;
  onChangeDate: (event: Event, selectedDate: Date | undefined) => void;
  showDatePicker: boolean;
  setShowDatePicker: Dispatch<React.SetStateAction<boolean>>;
}
const ExpenseForm: FC<ExpenseFormProps> = ({
  currentCount,
  date,
  dispatchFormState,
  expenseFormState,
  isEditing,
  onChange,
  onChangeDate,
  setShowDatePicker,
  showDatePicker,
}) => {
  const [showPayerModal, setShowPayerModal] = useState(false);
  const [showOwerModal, setShowOwerModal] = useState(false);
  const participantNames = useMemo(
    () => getParticipantNames(currentCount),
    [currentCount]
  );
  const isAllTaggedAsPayers = participantNames.every((name) =>
    expenseFormState.payers.includes(name)
  );
  const hasTaggedPayers = participantNames.some((name) =>
    expenseFormState.payers.includes(name)
  );

  const isAllTaggedAsparticipants = participantNames.every((name) =>
    expenseFormState.owers.includes(name)
  );
  const hasTaggedOwers = participantNames.some((name) =>
    expenseFormState.payers.includes(name)
  );

  return (
    <Container marginHorizontal={20}>
      <Input
        autoFocus
        placeholder={isEditing ? "Change the title" : "* Enter a title"}
        placeholderTextColor={colors.primary}
        defaultValue=""
        onChangeText={(v) => onChange(v, "title")}
        value={expenseFormState.title}
      />
      <Input
        placeholder={
          isEditing ? "Change the description" : "Enter a description"
        }
        placeholderTextColor={colors.primary}
        defaultValue=""
        onChangeText={(v) => onChange(v, "description")}
        value={expenseFormState.description}
      />
      <Input
        placeholder={isEditing ? "Change the amount" : "* Enter the amount"}
        keyboardType="numeric"
        placeholderTextColor={colors.primary}
        defaultValue=""
        onChangeText={(v) => {
          if (isEditing) {
            dispatchFormState({ field: "payers", type: "reset" });
            dispatchFormState({ field: "owers", type: "reset" });
          }
          onChange(v.replace(/[^0-9]/g, ""), "amount");
        }}
        value={expenseFormState.amount}
      />
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => {
          setShowDatePicker(true);
        }}
      >
        <Text style={styles.participantPickerText}>
          Date: {date.toLocaleDateString()}
        </Text>
        <MaterialIcons name="update" color={colors.primary} size={30} />
      </TouchableOpacity>

      {showDatePicker && (
        <>
          <DateTimePicker
            value={date}
            display="spinner"
            onChange={onChangeDate as any}
          />
          {Platform.OS === "ios" && (
            <Button
              title="Close date picker"
              onPress={() => {
                setShowDatePicker(false);
              }}
            />
          )}
        </>
      )}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.participantPicker}>
          <Text style={styles.participantPickerText}>Who paid?</Text>
          <Text style={styles.participantPickerText}>Who benefited?</Text>
        </View>
        <View style={styles.participantsContainer}>
          <View>
            <Card style={styles.checkAllButton}>
              <TouchableOpacity
                onPress={() => {
                  dispatchFormState({
                    field: "payers",
                    payload: participantNames,
                    type: isAllTaggedAsPayers ? "reset" : "fill",
                  });
                }}
              >
                <ParticipantCell
                  style={styles.participantCell}
                  title={isAllTaggedAsPayers ? "Uncheck all" : "Check all"}
                  titleStyles={styles.payersTitle}
                />
              </TouchableOpacity>
            </Card>
            {currentCount?.participants
              .sort(({ name: a }, { name: b }) => sortAlphabetically(a, b))
              .map((p) => {
                const isChecked = expenseFormState.payers.includes(p.name!);
                const selectPayers = () =>
                  dispatchFormState({
                    field: "payers",
                    payload: p.name,
                    type: isChecked ? "remove" : "add",
                  });
                return (
                  <Card key={p.id} style={styles.participantItem}>
                    <TouchableOpacity onPress={selectPayers}>
                      <ParticipantCell
                        icon={
                          isChecked
                            ? "radio-button-checked"
                            : "radio-button-unchecked"
                        }
                        iconColor={colors.primary}
                        onPress={selectPayers}
                        style={styles.participantCell}
                        title={p.name}
                        titleStyles={styles.payersTitle}
                      />
                    </TouchableOpacity>
                  </Card>
                );
              })}
            <Card style={styles.checkAllButton}>
              <TouchableOpacity
                disabled={!hasTaggedPayers}
                onPress={() => {
                  setShowPayerModal(true);
                }}
              >
                <ParticipantCell
                  style={styles.participantCell}
                  title="Custom amounts"
                  titleStyles={styles.payersTitle}
                  icon="account-balance-wallet"
                  iconColor={colors.primary}
                />
              </TouchableOpacity>
            </Card>
          </View>
          <View>
            <Card style={styles.checkAllButton}>
              <TouchableOpacity
                onPress={() => {
                  dispatchFormState({
                    field: "owers",
                    payload: participantNames,
                    type: isAllTaggedAsparticipants ? "reset" : "fill",
                  });
                }}
              >
                <ParticipantCell
                  style={styles.participantCell}
                  title={
                    isAllTaggedAsparticipants ? "Uncheck all" : "Check all"
                  }
                  titleStyles={styles.taggedTitle}
                />
              </TouchableOpacity>
            </Card>
            {currentCount?.participants.map((p) => {
              const isChecked = expenseFormState.owers.includes(p.name!);
              const selectTaggedUsers = () =>
                dispatchFormState({
                  field: "owers",
                  payload: p.name,
                  type: isChecked ? "remove" : "add",
                });
              return (
                <Card key={p.id} style={styles.participantItem}>
                  <TouchableOpacity onPress={selectTaggedUsers}>
                    <ParticipantCell
                      title={p.name}
                      icon={
                        isChecked
                          ? "radio-button-checked"
                          : "radio-button-unchecked"
                      }
                      iconColor={colors.primary}
                      style={styles.participantCell}
                      onPress={selectTaggedUsers}
                      titleStyles={styles.taggedTitle}
                    />
                  </TouchableOpacity>
                </Card>
              );
            })}
            <Card style={styles.checkAllButton}>
              <TouchableOpacity
                disabled={!hasTaggedOwers}
                onPress={() => {
                  setShowOwerModal(true);
                }}
              >
                <ParticipantCell
                  style={styles.participantCell}
                  title="Custom amounts"
                  titleStyles={styles.taggedTitle}
                  icon="account-balance-wallet"
                  iconColor={colors.green}
                />
              </TouchableOpacity>
            </Card>
          </View>
        </View>

        <BottomDrawer
          shouldShowModal={showPayerModal}
          setShouldShowModal={setShowPayerModal}
          title="Enter custom amounts in €"
        >
          <ScrollView>
            {expenseFormState.payers.map((p) => {
              const currentParticipantCustomAmount =
                expenseFormState.customPayers.find(
                  (customPayer) => customPayer.name === p
                )?.customAmount || 0;
              return (
                <CustomExpenseInput
                  key={p}
                  name={p}
                  value={currentParticipantCustomAmount}
                  dispatchFormState={dispatchFormState}
                  field={"customPayers"}
                />
              );
            })}

            <Button
              icon="input"
              iconColor={colors.white}
              onPress={() => {
                setShowPayerModal(false);
              }}
              title="Validate amounts"
              type="secondary"
            />
          </ScrollView>
        </BottomDrawer>

        <BottomDrawer
          shouldShowModal={showOwerModal}
          setShouldShowModal={setShowOwerModal}
          title="Enter custom amounts in €"
        >
          <ScrollView>
            {expenseFormState.owers.map((p) => {
              const currentParticipantCustomAmount =
                expenseFormState.customOwers.find(
                  (customOwer) => customOwer.name === p
                )?.customAmount || 0;
              return (
                <CustomExpenseInput
                  key={p}
                  name={p}
                  value={currentParticipantCustomAmount}
                  dispatchFormState={dispatchFormState}
                  field={"customOwers"}
                />
              );
            })}

            <Button
              icon="input"
              iconColor={colors.white}
              onPress={() => {
                setShowOwerModal(false);
              }}
              title="Validate amounts"
              type="secondary"
            />
          </ScrollView>
        </BottomDrawer>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  checkAllButton: { marginVertical: 20 },
  datePicker: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  participantCell: { minWidth: "25%", padding: 4 },
  participantItem: {
    borderColor: colors.primary,
    borderRadius: 8,
    color: colors.black,
    marginVertical: 4,
  },
  participantPicker: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  participantPickerText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  participantsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  payersTitle: { color: colors.primary },
  taggedTitle: { color: colors.green },
});

export default ExpenseForm;
