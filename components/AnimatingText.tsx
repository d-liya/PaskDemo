import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { tintIndigo } from "../constants/Colors";
import { text } from "../constants/Common";
import { Text, View } from "./Themed";

const styles = StyleSheet.create({
  baseStyle: {
    fontFamily: "space-mono-bold",
    color: tintIndigo,
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});

const AnimatingText = () => {
  const isToggle = useSharedValue(1);
  const isFocused = useIsFocused();
  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        if (isFocused) {
          isToggle.value = isToggle.value === 1 ? 0 : 1;
        }
      }, 1500);
      return () => clearInterval(interval);
    }, [])
  );
  const transition = useDerivedValue(() => {
    return withTiming(isToggle.value, { duration: 500 });
  });
  return (
    <View style={styles.container}>
      {text.map((item, index) => {
        const _scale = useDerivedValue(() => {
          return transition.value === 1 || item.isInName ? 1 : 0;
        }, [transition, item.isInName]);
        const _translateX = useDerivedValue(() => {
          return transition.value === 0 && item.isInName
            ? index === 0
              ? 75
              : -50
            : 0;
        }, [transition, item.isInName, index]);
        const rStyle = useAnimatedStyle(() => {
          return {
            transform: [
              { scale: withSpring(_scale.value) },
              { translateX: withSpring(_translateX.value) },
            ],
          };
        });
        return (
          <Animated.View key={index} style={[rStyle]}>
            <Text text="boldMediumTitle" style={styles.baseStyle}>
              {item.text}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

export default AnimatingText;
