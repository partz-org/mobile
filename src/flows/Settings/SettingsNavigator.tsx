import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../../theme/colors";
import { SettingsStackParamList } from "./types";
import { Login, PhoneLogin, Settings } from "./screens";
import { useUser } from "../../context";
import { auth } from "../../utils";

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => {
  const { user } = useUser();

  const isUserLoggedIn = !!user.phoneNumber && !!auth.currentUser?.uid;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: colors.lighter },
        headerTitleAlign: "center",
      }}
    >
      {isUserLoggedIn ? (
        <Stack.Screen name="RootSettings" component={Settings} />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: true,
              headerTitle: "Login",
            }}
          />
          <Stack.Screen
            name="PhoneLogin"
            component={PhoneLogin}
            options={{
              headerShown: true,
              headerTitle: "Login with your phone.",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
