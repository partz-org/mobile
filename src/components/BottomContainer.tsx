import React, { FC, useEffect, useState } from "react";
import { Keyboard, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

interface BottomContainerProps {
  shouldHide?: boolean;
  style?: ViewStyle;
}

const BottomContainer: FC<BottomContainerProps> = ({
  children,
  shouldHide,
  style,
}) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setHide(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setHide(false);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (hide || shouldHide) return null;

  return <View style={[styles.root, style]}>{children}</View>;
};
const styles = StyleSheet.create({
  root: {
    bottom: 0,
    display: "flex",
    flex: 1,
    flexDirection: "row",
    left: 0,
    marginBottom: 20,
    position: "absolute",
    right: 0,
  },
});

export default BottomContainer;
