import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type SettingsStackParamList = {
  Login: undefined;
  Register: undefined;
  RootSettings: undefined;
  PhoneLogin: undefined;
};

export type LoginNavigation = StackNavigationProp<
  SettingsStackParamList,
  "Login"
>;

export type RootSettingsRoute = RouteProp<
  SettingsStackParamList,
  "RootSettings"
>;
