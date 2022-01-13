import React, { FC, useEffect, useMemo, useState } from "react";
import { useReducer } from "react";
import { useMutation, useQueryClient } from "react-query";
import { CountForm, ErrorView, Loader } from "../../../../components";
import { useNotif } from "../../../../context";
import {
  getParticipantNames,
  isSimilarArrayOfString,
} from "../../../../helpers";
import {
  COUNTS,
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
  } = useQueryCountById(route.params.countId);

  const { sendNotif } = useNotif();

  if (!currentCount) return <ErrorView label="Something went wrong" />;

  const participantNames = useMemo(
    () => getParticipantNames(currentCount.participants),
    [currentCount.participants]
  );

  const QC = useQueryClient();

  useEffect(() => {
    navigation.setParams({ countTitle: currentCount.title });
  }, [currentCount, navigation]);
  useEffect(() => {
    setParticipants(participantNames);
  }, [participantNames]);

  const [participants, setParticipants] = useState<string[]>(participantNames);

  const updateCountMutation = useMutation(
    ({ countId, newCount }: { newCount: CountInput; countId: string }) =>
      updateCount(countId, newCount),
    {
      onError: handleError,
      onSuccess: async () => {
        sendNotif({
          message: "Your count was updated!",
        });
        QC.refetchQueries([COUNTS]);
        await refetch();
      },
    }
  );
  const deleteCountMutation = useMutation(() => deleteCount(currentCount.id!), {
    onSuccess: async () => {
      sendNotif({
        level: "danger",
        message: "Your count was deleted.",
      });
      QC.refetchQueries([COUNTS]);
      navigation.navigate("CountList");
    },
  });

  const deleteParticipantMutation = useMutation(
    ({ participantId }: { participantId: string }) =>
      deleteParticipant(participantId),
    {
      onError: handleError,
      onSuccess: async (data) => {
        QC.refetchQueries([COUNTS]);
        await refetch();
        sendNotif({ message: data.message });
      },
    }
  );

  const [countFormState, dispatchFormState] = useReducer(
    countFormReducer,
    initialCountState
  );

  if (isLoading) return <Loader />;

  if (!currentCount || error) return <ErrorView />;

  const onChangeText = (value: string, name: string) => {
    dispatchFormState({ field: name, payload: value });
  };

  const deleteParticipantFromCount = (participant: string) => {
    const participantId = currentCount.participants.find(
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
