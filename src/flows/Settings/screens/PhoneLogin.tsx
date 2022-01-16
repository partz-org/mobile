import React, { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { Button, Input, BottomContainer } from "@/components";
import { useNotif, useUser } from "@/context";
import { updateStoredUser } from "@/helpers";
import { LoginPayload, login, handleError, COUNTS } from "@/service";
import { colors } from "@/theme";
import { app, auth } from "@/utils";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient, useMutation } from "react-query";

const PhoneLogin: FC = () => {
  const [verificationId, setVerificationId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const { sendNotif } = useNotif();
  const recaptchaVerifier = React.useRef(null);
  const { dispatch } = useUser();
  const { goBack } = useNavigation();
  const QC = useQueryClient();

  const loginMutation = useMutation(
    (loginInput: LoginPayload) => login(loginInput),
    {
      onError: handleError,
      onSuccess: async (loggedUser) => {
        await updateStoredUser(dispatch, loggedUser);
        await QC.refetchQueries([COUNTS]);

        sendNotif({
          message: "Login successful!",
        });

        goBack();
      },
    }
  );

  return (
    <View style={styles.margin}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      />

      <Input
        style={{ marginTop: 50, fontSize: 17 }}
        placeholder="+1 999 999 9999"
        editable={!verificationId}
        placeholderTextColor={colors.primary}
        autoFocus
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
      />

      <Text>Enter your phone number</Text>

      <Input
        style={{ marginVertical: 10, fontSize: 17 }}
        placeholderTextColor={verificationId ? colors.primary : colors.grey}
        editable={!!verificationId}
        placeholder="123456"
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={setVerificationCode}
      />
      <Text>Enter the verification code</Text>

      <BottomContainer>
        <Button
          title="Send Code"
          disabled={!phoneNumber && !!verificationId}
          onPress={async () => {
            try {
              const phoneProvider = new PhoneAuthProvider(auth);
              const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                //override annoying type error
                recaptchaVerifier.current as any
              );
              setVerificationId(verificationId);
            } catch (err: any) {
              sendNotif({ message: err, level: "danger" });
            }
          }}
        />
        <Button
          title="Verify Code"
          disabled={!verificationCode}
          type="secondary"
          onPress={async () => {
            try {
              const credential = PhoneAuthProvider.credential(
                verificationId,
                verificationCode
              );
              await signInWithCredential(auth, credential);

              loginMutation.mutate({ phoneNumber: phoneNumber });

              sendNotif({ message: "ggggs" });
            } catch (err: any) {
              sendNotif({ message: err, level: "danger" });
            }
          }}
        />
      </BottomContainer>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    marginTop: 30,
  },
  inputContainer: {
    display: "flex",
    flex: 1,
    marginTop: 30,
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

export default PhoneLogin;
