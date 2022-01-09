import React, { useEffect, useRef } from "react";
import { Text, View, ViewProps } from "./Themed";
import AnimatedLottieView from "lottie-react-native";

export default function LoadingBar({
  style,
  variant = "SECONDARY",
  message,
  ...props
}: ViewProps & { variant?: "PRIMARY" | "SECONDARY"; message?: string }) {
  const ref = useRef<AnimatedLottieView | null>();
  useEffect(() => {
    ref.current?.play();
  }, []);
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingRight: 15,
          borderRadius: 10,
        },
        style,
      ]}
      tintColor
      {...props}
    >
      <AnimatedLottieView
        ref={(animation) => {
          ref.current = animation;
        }}
        style={{
          height: 25,
        }}
        source={
          variant === "PRIMARY"
            ? require("../assets/loading-primary.json")
            : require("../assets/loading-secondary.json")
        }
      />
      <Text text="semiBoldsecondaryText">{message ? message : "Syncing"}</Text>
    </View>
  );
}
