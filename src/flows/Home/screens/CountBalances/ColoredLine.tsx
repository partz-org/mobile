/* eslint-disable react-native/no-inline-styles */
import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../../../theme/colors";

interface ColoredLineProps {
  isCreditor: boolean;
  balanceToTotalPercent: string;
}

const ColoredLine: FC<ColoredLineProps> = ({
  isCreditor,
  balanceToTotalPercent,
}) => {
  return (
    <View
      style={[
        styles.Container,
        { alignSelf: isCreditor ? "flex-end" : "flex-start" },
      ]}>
      <View
        style={[
          styles.Color,
          {
            alignSelf: isCreditor ? undefined : "flex-end",
            backgroundColor: isCreditor ? colors.green : colors.red,
            width: balanceToTotalPercent,
          },
        ]}
      />
    </View>
  );
};

export default ColoredLine;

const styles = StyleSheet.create({
  Color: {
    backgroundColor: colors.green,
    height: "40%",
  },
  Container: {
    borderRadius: 8,
    display: "flex",
    height: "100%",
    justifyContent: "flex-end",
    position: "absolute",
    width: "50%",
  },
});
