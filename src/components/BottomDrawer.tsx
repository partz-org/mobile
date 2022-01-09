import React, { Dispatch, ReactNode, FC } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

interface BottomDrawerProps {
  children: ReactNode;
  shouldShowModal: boolean;
  setShouldShowModal: Dispatch<React.SetStateAction<boolean>>;
  title: string;
}
const BottomDrawer: FC<BottomDrawerProps> = ({
  children,
  shouldShowModal,
  setShouldShowModal,
  title,
}) => {
  return (
    <Modal
      visible={shouldShowModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setShouldShowModal(false);
      }}
    >
      <View style={styles.modalContainer}>
        <ScrollView
          style={styles.modalContent}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              setShouldShowModal(false);
            }}
          >
            <MaterialIcons name="close" size={30} />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>{title}</Text>
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignSelf: "flex-end",
  },
  modalContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 8,
    bottom: 0,
    flex: 1,
    flexBasis: "44%",
    height: "70%",
    left: 0,
    position: "absolute",
    right: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});

export default BottomDrawer;
