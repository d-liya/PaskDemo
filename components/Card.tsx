import React from "react";
import { StyleSheet } from "react-native";
import Colors, { tintIndigo } from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { TouchableOpacityProps, TouchableOpacity, View, Text } from "./Themed";

export default function Card(
  props: TouchableOpacityProps & {
    title: string;
    description?: string;
    color?: string;
  }
) {
  const colorTheme = useColorScheme();
  return (
    <TouchableOpacity isHaptic {...props}>
      <View
        style={[styles.container, { shadowColor: Colors[colorTheme].tint }]}
      >
        <View style={[styles.firstHalf]}>
          <View
            style={[
              styles.circle,
              props.color ? { backgroundColor: props.color } : {},
            ]}
          />
          <View style={styles.middle}>
            <Text
              text="semiBoldsecondaryText"
              style={styles.header}
              numberOfLines={1}
            >
              {props.title}
            </Text>
            <Text text="secondaryText">{props.description}</Text>
          </View>
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
    flexShrink: 1,
  },
  circle: {
    backgroundColor: "rgb(48,209,88)",
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
    flexShrink: 1,
  },
});
