import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card } from "@/components";
import { colors } from "@/theme";
import type { SettingsStackParamList } from "../types";

const Login: FC = () => {
  const { navigate } = useNavigation<NavigationProp<SettingsStackParamList>>();

  return (
    <View style={styles.margin}>
      <Card style={styles.card}>
        <Text style={styles.loginDescription}>
          {"Login to enjoy cool features 🚀"}
        </Text>
        <Text style={styles.loginDescription}>
          {"💾 Retreive all the counts you saved with your account"}
        </Text>
        <Text style={styles.loginDescription}>
          {
            "💳 Share your paypal details with your friends to settle your count!"
          }
        </Text>
      </Card>
      <Button
        icon="phone"
        iconColor={colors.primary}
        onPress={() => navigate("PhoneLogin")}
        textStyle={styles.buttonText}
        title="Login with your phone"
        style={styles.button}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    marginTop: 30,
  },
  button: {
    marginTop: 42,
    flex: 0,
  },
  buttonText: {
    fontSize: 18,
  },
  loginDescription: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
    marginVertical: 5,
  },
  margin: {
    display: "flex",
    flex: 1,
    marginHorizontal: 20,
  },
});

export default Login;
