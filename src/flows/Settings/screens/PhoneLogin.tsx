import React, { FC, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { useQueryClient, useMutation } from "react-query";
import PhoneInput from "react-native-phone-number-input";
import { Button, Input, BottomContainer, BottomDrawer } from "~/components";
import { useNotif, useUser } from "~/context";
import { updateStoredUser } from "~/helpers";
import { login, handleError, COUNTS } from "~/service";
import { colors } from "~/theme";
import { app, auth } from "~/utils";

const PhoneLogin: FC = () => {
  const [verificationId, setVerificationId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const { sendNotif } = useNotif();
  const recaptchaVerifier = React.useRef(null);
  const { dispatch } = useUser();
  const { goBack } = useNavigation();
  const QC = useQueryClient();
  const phoneInput = useRef<PhoneInput>(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    setValid(phoneInput.current?.isValidNumber(phoneNumber) || false);
  }, [phoneNumber]);

  const loginMutation = useMutation(login, {
    onError: handleError,
    onSuccess: async (loggedUser) => {
      await updateStoredUser(dispatch, loggedUser);
      await QC.refetchQueries([COUNTS]);

      sendNotif({
        message: "Login successful!",
      });

      goBack();
    },
  });

  const verifyPhoneCode = async () => {
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
  };

  return (
    <View style={styles.margin}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      />
      <PhoneInput
        ref={phoneInput}
        defaultCode={"FR"}
        defaultValue={phoneNumber}
        layout="first"
        onChangeFormattedText={setPhoneNumber}
        containerStyle={{ alignSelf: "center", marginBottom: 50 }}
        withDarkTheme
        withShadow
        autoFocus
      />

      <Button
        title="Send Code"
        disabled={!valid || !!verificationId}
        style={styles.sendCodeButton}
        onPress={async () => {
          try {
            const phoneProvider = new PhoneAuthProvider(auth);
            const verificationId = await phoneProvider.verifyPhoneNumber(
              phoneNumber,
              //override annoying type error
              recaptchaVerifier.current as any
            );
            setVerificationId(verificationId);
            setShouldShowModal(true);
          } catch (err: any) {
            sendNotif({ message: err, level: "danger" });
          }
        }}
      />

      <BottomDrawer
        shouldShowModal={shouldShowModal}
        setShouldShowModal={setShouldShowModal}
        title="Enter the code you received by SMS"
      >
        <Input
          autoFocus
          editable={!!verificationId}
          value={verificationCode}
          placeholder="123456"
          autoCompleteType="tel"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          onChangeText={setVerificationCode}
          style={styles.modalInput}
          onSubmitEditing={verifyPhoneCode}
        />
        <Button
          icon="login"
          iconColor={colors.white}
          onPress={verifyPhoneCode}
          title="Verify Code"
          type="secondary"
          style={styles.buttonVerifyPhone}
        />
      </BottomDrawer>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    marginTop: 30,
  },
  sendCodeButton: { flex: 0 },
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
    marginTop: 100,
  },
  modalInput: {
    alignSelf: "center",
    width: 200,
  },
  buttonVerifyPhone: {
    alignSelf: "center",
  },
});

export default PhoneLogin;
