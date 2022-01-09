/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Level, Timeout, useNotif } from "../context/notifContext";
import { colors } from "../theme/colors";
import Card from "./Card";

interface ToasterProps {
  message: string;
  level?: Level;
  timeout?: Timeout;
}

const Toaster: FC<ToasterProps> = ({
  level = "success",
  message,
  timeout = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { removeNotif } = useNotif();

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
        removeNotif();
      }, timeout);
    }
  }, [message]);

  if (!isVisible) {
    return null;
  }

  return (
    <Card>
      <View
        style={[
          styles.toastContainer,
          { backgroundColor: level === "danger" ? colors.red : colors.green },
        ]}>
        <Text style={styles.toastTitle}>{message}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor: colors.red,
    borderRadius: 12,
    display: "flex",
    justifyContent: "center",
    left: 0,
    marginHorizontal: 20,
    maxHeight: 140,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
  toastTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
    padding: 10,
  },
});

export default Toaster;
