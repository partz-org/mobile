import React, { FC } from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

interface CardProps {
  description?: string;
  icon?: string;
  iconColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  title?: string;
  titleStyles?: TextStyle;
  descriptionStyles?: TextStyle;
}

const Card: FC<CardProps> = ({ children, style }) => {
  return (
    <View style={[styles.shadow, style]}>
      <View style={styles.root}>{children}</View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  shadow: {
    borderRadius: 5,
    display: "flex",
    elevation: 5,
    marginHorizontal: 10,
    shadowColor: colors.black,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
