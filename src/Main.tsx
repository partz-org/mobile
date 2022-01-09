import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "react-query";

import { colors } from "./theme";
import { useNotif } from "./context";
import { Loader, Toaster } from "./components";
import { useFetchOrCreateUser } from "./hooks";
import BottomStackNavigator from "./flows/RootNavigator";
import { queryClient } from "./utils";

const Main = () => {
  const { notif } = useNotif();
  const user = useFetchOrCreateUser();

  // TODO: better handling of no user
  if (!user.id) {
    return <Loader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer
        linking={{
          config: {
            screens: {
              JoinCount: {
                parse: { countId: String },
                path: "joincount/:countId",
              },
            },
          },
          prefixes: ["partz://"],
        }}
      >
        <StatusBar backgroundColor={colors.lighter} barStyle="dark-content" />
        <Toaster {...notif} />
        <BottomStackNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default Main;
