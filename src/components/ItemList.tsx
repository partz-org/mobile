import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";
import Card from "./Card";
interface ItemListProps {
  createdAt: string;
  secondaryLabel: string;
  secondaryText?: string;
  onPress: () => void;
  onLongPress?: () => void;
  participants: string;
  title: string;
  total: number;
}

const ItemList: FC<ItemListProps> = ({
  createdAt,
  onPress,
  onLongPress,
  participants,
  title,
  total,
  secondaryLabel,
  secondaryText,
}) => (
  <Card style={styles.root}>
    <TouchableOpacity
      style={styles.count}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.bold} numberOfLines={1}>
          {secondaryLabel}
          <Text style={styles.secondaryText} numberOfLines={1}>
            {secondaryText ? secondaryText : " No description."}
          </Text>
        </Text>
        <Text style={styles.bold} numberOfLines={2}>
          Participants:
          <Text style={styles.secondaryText}>{participants}</Text>
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.rowContainer}>
          <Text>{new Date(createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text>{`${total}€`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  </Card>
);

const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  count: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginHorizontal: 10,
    overflow: "hidden",
  },
  root: { marginBottom: 8 },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
  },
  secondaryText: {
    fontWeight: "normal",
    overflow: "hidden",
  },
  title: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: 8,
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
    paddingHorizontal: 5,
  },
  titleContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    height: 100,
    justifyContent: "flex-start",
    marginHorizontal: 10,
    maxHeight: 100,
    overflow: "hidden",
  },
});

export default ItemList;
