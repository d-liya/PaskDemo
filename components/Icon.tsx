import React from "react";
import { Ionicons, TouchableOpacity, View } from "./Themed";
type IconProps = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  size?: number;
  onPress?: () => void;
  color?: string;
  style?: React.ComponentProps<typeof View>["style"];
};
export default function Icon({
  name,
  size = 26,
  onPress,
  color,
  style,
}: IconProps) {
  return (
    <TouchableOpacity {...{ onPress, style }}>
      <Ionicons {...{ name, size, color }} />
    </TouchableOpacity>
  );
}
