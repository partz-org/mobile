import React, { FC } from "react";
import { TextInputProps, TextStyle } from "react-native";
import { StyleSheet, TextInput } from "react-native";
import { colors } from "~/theme";

interface InputProps extends TextInputProps {
  style?: TextStyle;
}

const Input: FC<InputProps> = ({ style, ...props }) => {
  return (
    <TextInput
      style={[styles.root, style]}
      placeholderTextColor={colors.grey}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  root: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    color: colors.black,
    flex: 1,
    marginBottom: 15,
    maxHeight: 50,
  },
});
export default Input;
