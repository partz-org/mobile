import React, { FC } from "react";
import { Dimensions } from "react-native";
import { SafeAreaView, StyleSheet, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
const windowHeight = Dimensions.get("window").height;

interface ContainerProps {
  marginHorizontal?: number;
  scrollViewMargin?: number;
  style?: ViewStyle;
}

const Container: FC<ContainerProps> = ({
  children,
  marginHorizontal,
  scrollViewMargin,
  style,
}) => {
  return (
    <SafeAreaView
      style={[styles.root, { marginHorizontal: marginHorizontal }, style]}>
      <ScrollView
        style={[styles.scrollView, { marginBottom: scrollViewMargin }]}
        contentContainerStyle={styles.root}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    minHeight: windowHeight,
  },
  scrollView: {
    marginBottom: 110,
    paddingTop: 10,
  },
});

export default Container;
