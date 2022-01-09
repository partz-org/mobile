import React, { useState } from "react";
import { FC } from "react";
import * as Clipboard from "expo-clipboard";
import { StyleSheet, Text, View } from "react-native";
import { useQueryClient } from "react-query";
import {
  BottomContainer,
  Button,
  Container,
  ItemList,
  BottomDrawer,
  Input,
} from "../../../../components";

import { useNotif, useUser } from "../../../../context";
import { getCountById, handleError } from "../../../../service";
import { getParticipantNames, sortAlphabetically } from "../../../../helpers";
import { commonStyles, colors } from "../../../../theme";

import type { CountListNavigation } from "../../types";
import type { Count } from "../../../../types/count";

interface CountListProps {
  navigation: CountListNavigation;
}

const CountList: FC<CountListProps> = ({ navigation }) => {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [countIdToJoin, setCountIdToJoin] = useState<string>("");
  const { user } = useUser();

  const QC = useQueryClient();

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

        {user?.counts?.map((count: Count) => {
          const participantNames = getParticipantNames(count);

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