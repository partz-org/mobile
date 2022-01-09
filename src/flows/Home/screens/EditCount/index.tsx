import React, { FC, useEffect, useMemo, useState } from "react";
import { useReducer } from "react";
import { Alert } from "react-native";
import { useMutation } from "react-query";
import { CountForm, ErrorView, Loader } from "../../../../components";
import { useNotif, useUser } from "../../../../context";
import { isSimilarArrayOfString, updateStoredUser } from "../../../../helpers";
import {
  deleteCount,
  deleteParticipant,
  handleError,
  updateCount,
} from "../../../../service";
import { useQueryCountById } from "../../hooks";
import { EditCountNavigation, EditCountRoute } from "../../types";
import {
  countFormReducer,
  CountInput,
  initialCountState,
} from "../CreateCount/helper";
import BottomButtons from "./BottomButtons";

interface EditCountProps {
  navigation: EditCountNavigation;
  route: EditCountRoute;
}

const EditCount: FC<EditCountProps> = ({ route, navigation }) => {
  const {
    data: currentCount,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQueryCountById(route.params.countId);
  const { sendNotif } = useNotif();

  const [loading, setLoading] = useState(isLoading);
  const participantNames = useMemo(
    () => currentCount?.participants.map((p) => p.name) as string[],
    [currentCount?.participants]
  );

  useEffect(() => {
    navigation.setParams({ countTitle: currentCount?.title });
  }, [currentCount, navigation]);
  useEffect(() => {
    setParticipants(participantNames);
  }, [participantNames, isFetching]);

  const [participants, setParticipants] = useState<string[]>(participantNames);

  const { dispatch, user: userContext } = useUser();

  const updateCountMutation = useMutation(
    ({ countId, newCount }: { newCount: CountInput; countId: string }) =>
      updateCount(countId, newCount),
    {
      onError: handleError,
      onSuccess: async () => {
        sendNotif({
          message: "Your count was updated!",
        });
        updateStoredUser(dispatch, userContext);
        setLoading(true);
        await refetch();
        setLoading(false);
      },
    }
  );
  const deleteCountMutation = useMutation(
    () => deleteCount(currentCount?.id!),
    {
      onSuccess: async () => {
        sendNotif({
          level: "danger",
          message: "Your count was deleted.",
        });
        updateStoredUser(dispatch, userContext);
        navigation.navigate("CountList");
      },
    }
  );

  const deleteParticipantMutation = useMutation(
    ({ participantId }: { participantId: string }) =>
      deleteParticipant(participantId),
    {
      onError: handleError,
      onSuccess: async () => {
        updateStoredUser(dispatch, userContext);
        setLoading(true);
        await refetch();
        setLoading(false);
        Alert.alert("Success!", "The participant was removed from this count.");
      },
    }
  );

  const [countFormState, dispatchFormState] = useReducer(
    countFormReducer,
    initialCountState
  );

  if (loading) return <Loader />;

  if (!currentCount || error) return <ErrorView />;

  const onChangeText = (value: string, name: string) => {
    dispatchFormState({ field: name, payload: value });
  };

  const deleteParticipantFromCount = (participant: string) => {
    const participantId = currentCount?.participants.find(
      (p) => p.name === participant
    )?.id;

    if (!participantId) return;

    deleteParticipantMutation.mutate({
      participantId,
    });
  };

  const onPressValidate = () => {
    const participantsToAdd = participants.filter(
      (p) =>
        !currentCount.participants.some(
          (originalParticipant) => originalParticipant.name === p
        )
    );
    updateCountMutation.mutate({
      countId: currentCount.id,
      newCount: { ...countFormState, participantsToAdd },
    });
  };

  const onPressDelete = () => {
    deleteCountMutation.mutate();
  };

  const cannotSubmit =
    countFormState.title.length === 0 &&
    countFormState.description.length === 0 &&
    isSimilarArrayOfString(participants, participantNames);

  return (
    <CountForm
      countFormState={countFormState}
      deleteParticipantFromCount={deleteParticipantFromCount}
      isEditing
      onChangeText={onChangeText}
      participants={participants}
      setParticipants={setParticipants}
    >
      <BottomButtons
        disableDelete={deleteCountMutation.isLoading}
        disableValidate={updateCountMutation.isLoading || cannotSubmit}
        onPressValidate={onPressValidate}
        onPressDelete={onPressDelete}
      />
    </CountForm>
  );
};

export default EditCount;
