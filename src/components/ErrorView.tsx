import React, { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import Card from "./Card";
import Container from "./Container";

interface ErrorViewProps {
  label?: string;
}
const ErrorView: FC<ErrorViewProps> = ({ label = "Something went wrong." }) => (
  <Container>
    <View style={styles.ErrorContainer}>
      <MaterialIcons name="error" size={90} color={colors.red} />
      <Card>
        <Text style={styles.ErrorText}>{label}</Text>
      </Card>
    </View>
  </Container>
);

const styles = StyleSheet.create({
  ErrorContainer: {
    alignItems: "center",
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  ErrorText: {
    fontSize: 20,
    margin: 20,
  },
});

export default ErrorView;
