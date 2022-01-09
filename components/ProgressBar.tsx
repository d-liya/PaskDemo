import React from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "./Themed";

type Props = {
  total: number;
  completed: number;
  color?: string;
};

const MAX_WIDTH = 50;

export default function ProgressBar({
  total,
  completed,
  color = "rgb(255,149,0)",
}: Props) {
  return (
    <View style={[styles.container, { borderColor: color }]}>
      <Text text="tertiaryText" numberOfLines={1}>
        {completed}/{total}
      </Text>
      <View style={[styles.bar]}>
        <View
          style={[
            styles.progress,
            {
              width: MAX_WIDTH * (completed / total),
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: MAX_WIDTH,
  },
  bar: {
    marginTop: 4,
    height: 10,
    borderRadius: 5,
    width: "100%",
  },
  progress: {
    height: 10,
    borderRadius: 5,
    width: "100%",
  },
});
