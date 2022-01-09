import React, { FC } from "react";
import { Text } from "react-native";
import { useMutation } from "react-query";
import { Button, Container } from "../../../components";
import { useNotif, useUser } from "../../../context";
import { updateStoredUser } from "../../../helpers";
import { handleError, logout } from "../../../service";
import { colors, commonStyles } from "../../../theme";
import { auth } from "../../../utils/firebase";

const Settings: FC = () => {
  logout;

  const { sendNotif } = useNotif();
  const { dispatch } = useUser();

  const logoutMutation = useMutation(() => logout(), {
    onError: handleError,
    onSuccess: async (loggedOffUser) => {
      updateStoredUser(dispatch, loggedOffUser);
    },
  });

  return (
    <Container marginHorizontal={20}>
      <Text style={commonStyles.textHeading}>{"You are now loged in!"}</Text>
      <Text style={commonStyles.textHeading}>{"Work in Progress"}</Text>
      <Text style={commonStyles.textHeading}>
        {"New features will arrive soon 😁"}
      </Text>
      <Button
        icon="phone"
        iconColor={colors.primary}
        onPress={async () => {
          try {
            auth.signOut();

            logoutMutation.mutate();

            sendNotif({ message: "You are now logged out!" });
          } catch (err: any) {
            sendNotif({ message: err, level: "danger" });
          }
        }}
        type="primary"
        title="Loggout"
        style={{ flex: 0 }}
      />
    </Container>
  );
};

export default Settings;
