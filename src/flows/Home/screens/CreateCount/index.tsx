import React, { FC, useReducer, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { useQueryClient, useMutation } from "react-query";
import * as Clipboard from "expo-clipboard";
import { Button, CountForm } from "~/components";
import { useNotif } from "~/context";
import { createCount, handleError, COUNTS } from "~/service";
import { colors } from "~/theme";
import { CountNavigation } from "../../types";
import {
  countFormReducer,
  initialCountState,
  ParticipantInput,
} from "./helper";

const CreateCount: FC<CreateCountProps> = ({ navigation }) => {
  const { sendNotif } = useNotif();
  const QC = useQueryClient();

  const createCountMutation = useMutation(createCount, {
    onError: handleError,
    onSuccess: async (data) => {
      QC.refetchQueries([COUNTS]);
      Clipboard.setString(data!.id);

      // Clipboard.setString(`wej://joincount/${data!.id}`);
      sendNotif({
        message:
          "Count created! The number was copied to your clipboard. Share it with your friends!",
        timeout: 5000,
      });
      navigation.goBack();
    },
  });

  const [participants, setParticipants] = useState<string[]>([]);

  const [countFormState, dispatchFormState] = useReducer(
    countFormReducer,
    initialCountState
  );

  const onChangeText = (value: string, name: string) => {
    dispatchFormState({ field: name, payload: value });
  };

  const onSubmit = async () => {
    if (!countFormState.title || !countFormState.name) {
      Alert.alert("Wrong input", "Please fill in all the required fields.");
    }

    const totalParticipants: ParticipantInput[] = [];

    participants.forEach((participant: string) => {
      totalParticipants.push({ name: participant });
    });
    totalParticipants.push({ name: countFormState.name });

    createCountMutation.mutate({
      ...countFormState,
      participants: totalParticipants,
      userToTag: countFormState.name,
    });
  };

  const cannotSubmit =
    countFormState.title.length === 0 ||
    countFormState.name.length === 0 ||
    participants.length === 0;

  return (
    <CountForm
      countFormState={countFormState}
      onChangeText={onChangeText}
      participants={participants}
      setParticipants={setParticipants}
    >
      <Button
        disabled={createCountMutation.isLoading || cannotSubmit}
        icon="check"
        iconColor={colors.primary}
        onPress={onSubmit}
        title="Create your count"
        style={styles.bottomButton}
      />
    </CountForm>
  );
};

const styles = StyleSheet.create({
  bottomButton: { flex: 0 },
});

interface CreateCountProps {
  navigation: CountNavigation;
}

export default CreateCount;
