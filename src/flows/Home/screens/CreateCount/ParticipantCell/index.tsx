import React, { FC } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { View, Text, TouchableOpacity, TextStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ParticipantCellProps {
  icon?: string;
  iconColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
  title?: string;
  titleStyles?: TextStyle;
}

const ParticipantCell: FC<ParticipantCellProps> = ({
  icon,
  iconColor,
  onPress,
  style,
  title,
  titleStyles,
}) => {
  return (
    <>
      <View style={[styles.titleContainer, style]}>
        {title ? (
          <Text style={[styles.title, titleStyles]} numberOfLines={2}>
            {title}
          </Text>
        ) : null}
        {icon && (
          <TouchableOpacity onPress={onPress} style={styles.icon}>
            <MaterialIcons name={icon as any} color={iconColor} size={15} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  icon: {
    marginLeft: 10,
  },
  title: {
    color: "red",
  },
  titleContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
});

export default ParticipantCell;
