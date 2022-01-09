import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../theme/colors";

const Loader = () => {
  return (
    <View style={styles.root}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { display: "flex", flex: 1, justifyContent: "center" },
});

export default Loader;
