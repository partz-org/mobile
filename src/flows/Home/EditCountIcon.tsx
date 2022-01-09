import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { FC } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { HomeStackParamList } from "./types";

interface EditCountIconProps {
  countId: string;
  countTitle: string;
}
const EditCountIcon: FC<EditCountIconProps> = ({ countId, countTitle }) => {
  const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();
  return (
    <TouchableOpacity
      style={styles.iconContainer}
      onPress={() => navigate("EditCount", { countId, countTitle })}
    >
      <MaterialIcons name="edit" color={colors.primary} size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 20,
  },
});

export default EditCountIcon;
