import React, { FC } from "react";
import { Text, TextStyle, TouchableOpacity } from "react-native";
import { ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export type ColorType = "primary" | "secondary" | "danger";

interface ButtonProps {
  disabled?: boolean;
  icon?: string;
  iconColor?: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  title: string;
  type?: ColorType;
}
const getColor = (type: ColorType, disabled?: boolean) => {
  if (disabled) {
    return colors.black;
  }
  switch (type) {
    case "primary":
      return colors.black;
    case "secondary":
      return colors.white;
    case "danger":
      return colors.red;

    default:
      return colors.black;
  }
};

const getBackgroundColor = (type: ColorType, disabled?: boolean) => {
  if (disabled) {
    return colors.light;
  }
  switch (type) {
    case "primary":
      return colors.white;
    case "secondary":
      return colors.primary;
    case "danger":
      return colors.white;

    default:
      return colors.white;
  }
};

const Button: FC<ButtonProps> = ({
  disabled,
  icon,
  iconColor,
  onPress,
  style,
  textStyle,
  title,
  type = "primary",
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      styles.coucou,
      { backgroundColor: getBackgroundColor(type, disabled) },
      style,
    ]}
  >
    {icon ? (
      <MaterialIcons name={icon as any} color={iconColor} size={30} />
    ) : null}
    <Text style={[styles.text, { color: getColor(type, disabled) }, textStyle]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  coucou: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    display: "flex",
    flex: 1,
    flexDirection: "row",
    margin: 10,
    padding: 5,
  },
  text: {
    fontWeight: "bold",
    margin: 8,
  },
});

export default Button;
