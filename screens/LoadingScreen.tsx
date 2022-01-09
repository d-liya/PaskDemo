import * as React from "react";
import { StyleSheet } from "react-native";
import ActivityIndicator from "../components/ActivityIndicator";
import { Text, View } from "../components/Themed";
import { RootStackScreenProps } from "../types";
// No Seeting Screen for now
export default function LoadingScreen({
  navigation,
}: RootStackScreenProps<"Loading">) {
  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
