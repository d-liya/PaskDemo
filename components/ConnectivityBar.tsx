import React, { useEffect, useRef } from "react";
import { Text, View, ViewProps } from "./Themed";
import AnimatedLottieView from "lottie-react-native";

export default function ConnectivityBar({ style, ...props }: ViewProps) {
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
          paddingLeft: 12,
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
        source={require("../assets/wifi-loading.json")}
      />
      <Text style={{ marginLeft: 10 }} text="semiBoldsecondaryText">
        No Internet
      </Text>
    </View>
  );
}
