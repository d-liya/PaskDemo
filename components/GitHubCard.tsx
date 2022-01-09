import React from "react";
import { StyleSheet } from "react-native";
import Colors, { tintIndigo } from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { GitHubProject } from "../types";
import { View, Text, TouchableOpacity, TouchableOpacityProps } from "./Themed";

export default function GitHubCard({
  name,
  description,
  url,
  id,
  selected,
  repoPrivate,
  fork,
  ...props
}: GitHubProject &
  TouchableOpacityProps & {
    selected?: boolean;
    repoPrivate?: boolean;
    fork?: boolean;
  }) {
  const colorTheme = useColorScheme();
  return (
    <TouchableOpacity
      style={[styles.container, { shadowColor: Colors[colorTheme].tint }]}
      {...props}
      tintColor={selected}
      isHaptic
    >
      <View style={styles.firstHalf} tintColor={selected}>
        <View style={styles.circle} />
        <View style={styles.middle} tintColor={selected}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexShrink: 1,
            }}
            tintColor={selected}
          >
            <Text
              text="semiBoldbodyText"
              style={styles.header}
              numberOfLines={1}
            >
              {name}
              {/* Hello world this is dilum iama */}
            </Text>
            <View
              style={{
                paddingHorizontal: 5,
                paddingVertical: 2.5,
                borderRadius: 8,
                marginLeft: 5,
                backgroundColor: tintIndigo,
              }}
            >
              <Text text="tertiaryText" color="white">
                {repoPrivate ? "Private" : fork ? "Forked" : "Public"}
              </Text>
            </View>
          </View>

          <Text text="secondaryText" numberOfLines={1}>
            {description}
          </Text>
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
    width: 50,
    height: 50,
    borderRadius: 50 / 3,
  },
  header: {
    paddingBottom: 4,
    width: "80%",
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
