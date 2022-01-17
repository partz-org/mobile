import React, { useState } from "react";
import { FC } from "react";
import * as Clipboard from "expo-clipboard";
import { StyleSheet, Text, View } from "react-native";
import { useQuery, useQueryClient } from "react-query";
import {
  Button,
  BottomContainer,
  Container,
  ItemList,
  BottomDrawer,
  Input,
  ErrorView,
  Loader,
} from "~/components";
import { useNotif } from "~/context";
import { getParticipantNames, sortAlphabetically } from "~/helpers";
import { COUNTS, getUserCounts, getCountById, handleError } from "~/service";
import { commonStyles, colors } from "~/theme";
import { Count } from "~/types/count";
import { CountListNavigation } from "../../types";

interface CountListProps {
  navigation: CountListNavigation;
}

const CountList: FC<CountListProps> = ({ navigation }) => {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [countIdToJoin, setCountIdToJoin] = useState<string>("");

  const QC = useQueryClient();

  const { data: userCounts, isLoading } = useQuery<Count[]>(
    COUNTS,
    getUserCounts
  );

  if (isLoading) return <Loader />;

  if (!userCounts) return <ErrorView label="Something went wrong." />;

  const { navigate } = navigation;

  const handleJoinCount = async (countId: string) => {
    if (countId) {
      setCountIdToJoin("");
      setShouldShowModal(false);

      try {
        const data = await QC.fetchQuery(countId, () => getCountById(countId));
        navigate("JoinCount", {
          countId,
          countTitle: data.title,
          countTotal: data.total,
          participants: data.participants,
        });
      } catch (error) {
        handleError(new Error("Please provide a valid ID."));
        return;
      }
    } else {
      handleError(new Error("Please provide an ID."));
      setShouldShowModal(false);
      return;
    }
  };

  const handleNavigateToCount = (countId: Count) => {
    navigate("ExpenseList", {
      countId: countId.id,
      countTitle: countId.title,
      countTotal: countId.total,
    });
  };

  const { sendNotif } = useNotif();

  return (
    <>
      <Container scrollViewMargin={100}>
        <Text style={commonStyles.textHeading}>Your Counts</Text>

        {userCounts?.map((count: Count) => {
          const participantNames = getParticipantNames(count.participants);

          return (
            <ItemList
              createdAt={count.createdAt}
              secondaryLabel="Desc: "
              secondaryText={count.description}
              title={count.title}
              onPress={() => handleNavigateToCount(count)}
              onLongPress={() => {
                Clipboard.setString(count.id);
                sendNotif({
                  message:
                    "The number of your count has been copied to your Clipboard!",
                });
              }}
              participants={`${participantNames
                .sort(sortAlphabetically)
                .join(" ")}`}
              key={count.id}
              total={count.total}
            />
          );
        })}

        <BottomDrawer
          shouldShowModal={shouldShowModal}
          setShouldShowModal={setShouldShowModal}
          title="Enter the count N° provided"
        >
          <Input
            autoFocus
            value={countIdToJoin}
            onChangeText={(e) => {
              setCountIdToJoin(e);
            }}
            style={styles.modalInput}
            onSubmitEditing={() => handleJoinCount(countIdToJoin)}
          />
          <Button
            icon="login"
            iconColor={colors.white}
            onPress={() => handleJoinCount(countIdToJoin)}
            title="Join the count"
            type="secondary"
            style={styles.buttonJoinCount}
          />
        </BottomDrawer>
      </Container>

      <BottomContainer>
        <View style={commonStyles.buttonContainer}>
          <Button
            icon="add-box"
            iconColor={colors.primary}
            onPress={() => navigate("CreateCount")}
            title="Create a count"
          />
          <Button
            icon="input"
            iconColor={colors.white}
            onPress={() => {
              setShouldShowModal(true);
            }}
            title="Join a count"
            type="secondary"
          />
        </View>
      </BottomContainer>
    </>
  );
};

const styles = StyleSheet.create({
  buttonJoinCount: {
    alignSelf: "center",
  },
  modalInput: {
    alignSelf: "center",
    width: 200,
  },
});

export default CountList;
