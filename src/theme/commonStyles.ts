import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textHeading: {
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 24,
  },
});
