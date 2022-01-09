import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import Colors, { defaultColor } from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Icon from "./Icon";
import { View, Text, TouchableOpacity } from "./Themed";
import moment from "moment";
import { Notification } from "../types";

export default function NotificationCard({
  completedAt,
  text,
  id,
  title,
}: Notification) {
  const colorTheme = useColorScheme();
  const navigate = useNavigation();
  return (
    <TouchableOpacity
      style={[styles.container, { shadowColor: Colors[colorTheme].tint }]}
      isHaptic
    >
      <View style={styles.firstHalf}>
        <View style={styles.circle} />
        <Icon
          size={30}
          name="checkmark-sharp"
          style={{
            position: "absolute",
            backgroundColor: "transparent",
          }}
          color={defaultColor}
        />
        <View style={styles.middle}>
          <Text text="semiBoldbodyText" numberOfLines={1}>
            {title}
          </Text>

          <Text text="secondaryText">{text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    justifyContent: "space-between",
  },
  circle: {
    backgroundColor: "rgb(255,149,0)",
    width: 30,
    height: 30,
    borderRadius: 30 / 3,
  },
  header: {
    paddingBottom: 4,
  },
  middle: {
    paddingHorizontal: 10,
    flexShrink: 1,
  },
  firstHalf: {
    flexDirection: "row",
    alignItems: "center",
  },
});
