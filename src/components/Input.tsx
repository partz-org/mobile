import React, { FC } from "react";
import { TextInputProps, TextStyle } from "react-native";
import { StyleSheet, TextInput } from "react-native";
import { colors } from "../theme/colors";

interface InputProps extends TextInputProps {
  style?: TextStyle;
}

const Input: FC<InputProps> = ({ style, ...rest }) => {
  return <TextInput style={[styles.root, style]} {...rest} />;
};

const styles = StyleSheet.create({
  root: {
    borderBottomColor: colors.grey,
    borderBottomWidth: 2,
    color: colors.black,
    flex: 1,
    marginBottom: 15,
    maxHeight: 50,
  },
});
export default Input;
