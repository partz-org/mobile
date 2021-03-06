import React, { FC } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useMutation, useQueryClient } from "react-query";
import { ErrorView, Container, Card } from "~/components";
import { useUser } from "~/context";
import { updateParticipant, handleError, COUNTS } from "~/service";
import { colors } from "~/theme";
import { JoinCountNavigation, JoinCountRoute } from "../../types";
import ParticipantCell from "../CreateCount/ParticipantCell";

interface JoinCountProps {
  navigation: JoinCountNavigation;
  route: JoinCountRoute;
}

const JoinCount: FC<JoinCountProps> = ({ route, navigation }) => {
  const { user: userContext } = useUser();
  const QC = useQueryClient();

  const { countId, countTitle, countTotal, participants } = route.params;

  const countParams = {
    countId,
    countTitle,
    countTotal,
  };

  const tagUserToParticipant = useMutation(updateParticipant, {
    onError: handleError,
    onSuccess: async () => {
      await QC.refetchQueries(countId);
      await QC.refetchQueries(COUNTS);
      navigation.navigate("ExpenseList", countParams);
    },
  });

  if (!participants) {
    return (
      <ErrorView
        label={
          "We couldn't find the count associated with your link.\n\nPlease double check it.\n\nIt might also be a server problem."
        }
      />
    );
  }

  if (participants.some((p) => p.user === userContext.id)) {
    return <ErrorView label="You already are in this count." />;
  }

  return (
    <Container>
      {participants.map((participant, i: number) => (
        <Card key={i} style={styles.participantItem}>
          <TouchableOpacity
            onPress={() => {
              tagUserToParticipant.mutate({
                participantId: participant.id,
                userId: userContext.id,
              });
              navigation.navigate("ExpenseList", countParams);
            }}
          >
            <ParticipantCell title={participant.name} />
          </TouchableOpacity>
        </Card>
      ))}
    </Container>
  );
};

const styles = StyleSheet.create({
  participantItem: {
    color: colors.black,
    margin: 4,
    minWidth: 150,
  },
});

export default JoinCount;
