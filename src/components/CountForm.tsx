import React, { useState, Dispatch, FC, useRef } from "react";
import { Alert, View, TextInput, ScrollView, StyleSheet } from "react-native";
import { CountFormState } from "../flows/Home/screens/CreateCount/helper";
import ParticipantCell from "../flows/Home/screens/CreateCount/ParticipantCell";
import { capitalizeWord } from "../helpers/capitalizeWord";
import { colors } from "../theme/colors";
import BottomContainer from "./BottomContainer";
import Button from "./Button";
import Card from "./Card";
import Container from "./Container";
import Input from "./Input";

interface CountFormProps {
  countFormState: CountFormState;
  deleteParticipantFromCount?: (participant: string) => void;
  isEditing?: boolean;
  onChangeText: (value: string, name: string) => void;
  participants: string[];
  setParticipants: Dispatch<React.SetStateAction<string[]>>;
}

const CountForm: FC<CountFormProps> = ({
  children,
  countFormState,
  deleteParticipantFromCount,
  isEditing,
  onChangeText,
  participants,
  setParticipants,
}) => {
  const [participantInput, setParticipantInput] = useState<string>("");

  const addParticipantToList = (participant: string): void => {
    if (!participant) {
      return;
    }

    participant = capitalizeWord(participant);

    if (participants.includes(participant)) {
      Alert.alert(
        "Participant already entered",
        "You cannot enter the same participant twice. Please choose another name."
      );
      return;
    }
    setParticipants([...participants, participant]);
    setParticipantInput("");
    if (ref) {
      setTimeout(() => {
        // @ts-ignore
        ref.current.focus();
      }, 500);
    }
  };

  const ref = useRef(null);

  const removeParticipantFromList = (index: number) => {
    setParticipants(participants.filter((_p, i) => i !== index));
  };

  return (
    <>
      <Container marginHorizontal={20}>
        <Input
          autoFocus
          placeholder={isEditing ? "Change the title " : "* Enter a title"}
          placeholderTextColor={colors.primary}
          defaultValue=""
          onChangeText={(e) => onChangeText(e, "title")}
          value={countFormState.title}
          maxLength={22}
        />
        <Input
          placeholder={
            isEditing ? "Change the description " : "Enter a description"
          }
          placeholderTextColor={colors.primary}
          defaultValue=""
          style={styles.root}
          maxLength={200}
          value={countFormState.description}
          onChangeText={(e) => onChangeText(e, "description")}
        />
        {isEditing ? null : (
          <Input
            placeholder="* Enter your name"
            placeholderTextColor={colors.primary}
            maxLength={15}
            defaultValue=""
            onChangeText={(e) => onChangeText(e, "name")}
            value={countFormState.name}
          />
        )}

        <View style={styles.participantInputContainer}>
          <TextInput
            ref={ref}
            placeholder="* Add a participant"
            placeholderTextColor={colors.black}
            style={styles.participantInput}
            value={participantInput}
            onChangeText={setParticipantInput}
            onEndEditing={() => addParticipantToList(participantInput)}
          />
          <Button
            icon="add-box"
            iconColor={colors.primary}
            onPress={() => addParticipantToList(participantInput)}
            title="Add"
            style={styles.participantButton}
          />
        </View>

        <ScrollView
          style={styles.scroll}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.participantList}>
            {participants.map((participant: string, i: number) => (
              <Card key={i} style={styles.participantItem}>
                <ParticipantCell
                  title={participant}
                  titleStyles={styles.participantItemText}
                  icon="close"
                  iconColor={colors.red}
                  onPress={() => {
                    if (isEditing && deleteParticipantFromCount) {
                      deleteParticipantFromCount(participant);
                    } else {
                      removeParticipantFromList(i);
                    }
                  }}
                />
              </Card>
            ))}
          </View>
        </ScrollView>
      </Container>

      <BottomContainer style={styles.bottomContainer}>
        {children}
      </BottomContainer>
    </>
  );
};

const styles = StyleSheet.create({
  bottomContainer: { justifyContent: "center" },
  participantButton: {
    flexBasis: 80,
    flexGrow: 0,
    margin: 0,
    padding: 0,
  },
  participantInput: {
    flex: 1,
    fontWeight: "bold",
  },
  participantInputContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  participantItem: {
    color: colors.black,
    flexBasis: "44%",
    marginVertical: 4,
  },
  participantItemText: { color: colors.black, fontWeight: "bold", margin: 8 },
  participantList: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  scroll: { flex: 1, marginBottom: 100 },
});

export default CountForm;
