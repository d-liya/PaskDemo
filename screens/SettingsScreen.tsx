import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Card from "../components/Card";
import Navbar from "../components/NavBar";
import * as WebBrowser from "expo-web-browser";
import { ScrollView, Text, View } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import { useAuthStore } from "../redux/authSlice";
import { useCloseModal, useOpenModal } from "../redux/modalSlice";
import { red } from "../constants/Colors";
import ConfModalWithStore from "../components/ConfModalWithStore";
import useAuth from "../hooks/useAuth";
import Constants from "expo-constants";
// No Seeting Screen for now

export default function SettingsScreen({
  navigation,
}: RootStackScreenProps<"Settings">) {
  const { status } = useAuthStore();
  const openModal = useOpenModal();
  const closeModal = useCloseModal();
  const { signOutAsync } = useAuth();
  const handleOpenInBrowser = (link: string) => {
    WebBrowser.openBrowserAsync(link);
  };
  const signOut = () => {
    signOutAsync().finally(() => {
      closeModal();
    });
  };
  const handleSignOut = () => {
    status === "offline"
      ? openModal({
          message: "Cannot sign out when you are in offline mode",
          activeModalName: "INFO",
          btnText: "Cancel",
          btnColor: red,
        })
      : openModal({
          message: "Are you sure you want to sign out?",
          leftBtnText: "Sign Out",
          rightBtnText: "Cancel",
          leftBtnColor: red,
          activeModalName: "SIGNOUT",
        });
  };
  return (
    <>
      <ConfModalWithStore
        onLeftBtnPress={signOut}
        onRightBtnPress={closeModal}
        modalName="SIGNOUT"
      />
      <View style={styles.container}>
        <Navbar title="Settings" showCloseButtom showBackButtom={false} />
        <ScrollView>
          <View style={styles.containerOne}>
            <Text text="semiBoldbodyText" style={{ paddingBottom: 10 }}>
              Support
            </Text>
            <Card
              title="Privacy Policy"
              description="This also refers to our 'Terms and Conditions'"
              color="rgb(10,132,255)"
              onPress={() =>
                handleOpenInBrowser("https://pask-6f72b.web.app/privacy")
              }
            />
            <Card
              title="Supported Keywords"
              description="When you commit a message, you can use these keywords to help us understand what you're trying to say."
              color="rgb(10,132,255)"
              onPress={() =>
                handleOpenInBrowser(
                  "https://pask-6f72b.web.app/faq?goToKeywords=true"
                )
              }
            />
            <Card
              title="FAQs"
              description="If you are having trouble using the app, please check out our FAQs"
              color="rgb(10,132,255)"
              onPress={() =>
                handleOpenInBrowser("https://pask-6f72b.web.app/faq")
              }
            />
          </View>
          <View style={styles.containerOne}>
            <Text text="semiBoldbodyText" style={{ paddingBottom: 10 }}>
              App Info
            </Text>

            <Card
              title="Version"
              description={Constants.manifest?.version + ""}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text text="semiBoldbodyText" style={{ textAlign: "center" }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: red,
  },
  containerOne: {
    padding: 16,
  },
});
