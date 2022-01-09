import { Linking } from "react-native";

export const openLink = async (url: string) => {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.error("Could not open link", error);
  }
};
