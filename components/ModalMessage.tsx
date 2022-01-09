import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Text, TouchableOpacity, View } from "./Themed";
type Props = {
  visible: boolean;
  children: React.ReactNode;
};
export default function ModalMessage({ visible = true, children }: Props) {
  const bgStyle = useAnimatedStyle(() => {
    const opacity = withSpring(visible ? 1 : 0);
    return {
      opacity,
    };
  });
  const containerStyle = useAnimatedStyle(() => {
    const translateY = withSpring(visible ? 0 : 100000);
    return {
      transform: [{ translateY }],
    };
  });
  return (
    <Animated.View style={[styles.background, bgStyle]}>
      <Animated.View style={[containerStyle]}>
        <View tintColor style={{ padding: 20, borderRadius: 16 }}>
          <Text>Do You Want TO DELete This TODO?</Text>
          <TouchableOpacity
            style={{ alignItems: "center", padding: 10, marginVertical: 10 }}
          >
            <Text>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            tintColor
            style={{ alignItems: "center", padding: 10, marginVertical: 10 }}
          >
            <Text>No</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
