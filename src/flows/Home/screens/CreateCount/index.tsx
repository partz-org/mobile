import React, { FC, useReducer, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import Button from "../../../../components/Button";
import { colors } from "../../../../theme/colors";
import { handleError } from "../../../../service/helper";
import * as Clipboard from "expo-clipboard";
import {
  countFormReducer,
  CountInput,
  initialCountState,
  ParticipantInput,
} from "./helper";
import { useMutation } from "react-query";
import { CountNavigation } from "../../types";
import CountForm from "../../../../components/CountForm";
import { updateStoredUser } from "../../../../helpers/updateStoredUser";
import { useNotif, useUser } from "../../../../context/";
import { createCount } from "../../../../service/counts";

const CreateCount: FC<CreateCountProps> = ({ navigation }) => {
  const { dispatch, user: userContext } = useUser();
  const { sendNotif } = useNotif();

  const createCountMutation = useMutation(
    (newCount: CountInput) => createCount(newCount),
    {
      onError: handleError,
      onSuccess: async (data) => {
        updateStoredUser(dispatch, userContext);

        Clipboard.setString(data!.id);

        // Clipboard.setString(`wej://joincount/${data!.id}`);
        sendNotif({
          message:
            "Count created! The number was copied to your clipboard. Share it with your friends!",
          timeout: 5000,
        });
        navigation.goBack();
      },
    }
  );
  const { user } = useUser();

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
      creatorId: user?.id,
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
