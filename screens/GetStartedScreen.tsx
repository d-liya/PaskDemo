import * as React from "react";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaViewWithFlex,
  TouchableOpacity,
  Ionicons,
  Text,
} from "../components/Themed";
import { tintIndigo } from "../constants/Colors";
import useAuth from "../hooks/useAuth";
import { GITHUB_USER, pushNotificationStorageKey } from "../constants/Common";
import AnimatingText from "../components/AnimatingText";
import { useSecureStore } from "../hooks/useSecureStore";
import useFireStore from "../hooks/useFireStore";
import ConfModalWithStore from "../components/ConfModalWithStore";
import { useCloseModal, useOpenModal } from "../redux/modalSlice";
import { useAuthStore } from "../redux/authSlice";
import { getFromGitHub } from "../methods/gitHubApis";
import ActivityIndicator from "../components/ActivityIndicator";

export default function GetStartedScreen() {
  const { signInAsync, signOutAsync } = useAuth();
  const { getValuesFor } = useSecureStore();
  const { setDocument } = useFireStore();
  const closeModal = useCloseModal();
  const openModal = useOpenModal();
  const { status } = useAuthStore();

  const handleOnPress = async () => {
    try {
      openModal({
        activeModalName: "GETSTARTED",
        loading: true,
      });
      const res = await signInAsync();

      if (res.type === "success") {
        const gitHubToken = res.githubToken;
        const pushToken = await getValuesFor(pushNotificationStorageKey);
        const userId = res.user?.providerData[0].uid;
        const _res = await getFromGitHub(GITHUB_USER + userId, gitHubToken!);
        const publicUserInfo = await _res.json();
        await setDocument(
          { gitHubToken, pushToken, ...publicUserInfo },
          "users",
          res?.user?.uid
        );
        closeModal();
      } else if (res.type === "error") {
        openModal({
          message: "Opps! Something went wrong. Please sign in again.",
          activeModalName: "GETSTARTED",
          btnText: "Ok",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return status === "loading" ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
    </View>
  ) : (
    <>
      <ConfModalWithStore onBtnPress={closeModal} modalName="GETSTARTED" />
      <SafeAreaViewWithFlex style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text text="boldMediumTitle" style={styles.header}>
            MANAGING YOUR
          </Text>
          <AnimatingText />
          <Text text="boldMediumTitle" style={{ textAlign: "center" }}>
            MADE SIMPLE
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleOnPress}>
          <Ionicons name="logo-github" size={24} color="white" />
          <Text
            text="semiBoldbodyText"
            style={{ textAlign: "center", marginLeft: 10, color: "white" }}
          >
            Sign In With GitHub
          </Text>
        </TouchableOpacity>
        <Text text="tertiaryText" style={styles.body}>
          With a commit message tick your tasks off. {"\n"}Sign in with your
          github account to get started.
        </Text>
      </SafeAreaViewWithFlex>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginTop: 16,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  body: {
    marginVertical: 16,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 16,
    flexDirection: "row",
    backgroundColor: tintIndigo,
    alignItems: "center",
  },
});
