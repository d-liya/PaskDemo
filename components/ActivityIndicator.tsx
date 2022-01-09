import AnimatedLottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import useColorScheme from "../hooks/useColorScheme";
type Props = {
  variant?: "PRIMARY" | "SECONDARY";
};
export default function ActivityIndicator({ variant = "SECONDARY" }: Props) {
  const ref = useRef<AnimatedLottieView | null>();
  useEffect(() => {
    ref.current?.play();
  }, []);

  return (
    <AnimatedLottieView
      ref={(animation) => {
        ref.current = animation;
      }}
      style={{
        alignSelf: "center",
        height: 45,
      }}
      source={
        variant === "PRIMARY"
          ? require("../assets/loading-primary.json")
          : require("../assets/loading-secondary.json")
      }
    />
  );
}
