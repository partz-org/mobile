import React from "react";
import { LogBox } from "react-native";
import { NotifProvider } from "./src/context/notifContext";
import { UserProvider } from "./src/context/userContext";
import Main from "./src/Main";
import * as Notifications from "expo-notifications";

// React-Query makes this warning
LogBox.ignoreLogs(["Setting a timer"]);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App = () => (
  <UserProvider>
    <NotifProvider>
      <Main />
    </NotifProvider>
  </UserProvider>
);

export default App;
