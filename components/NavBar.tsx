import Constants from "expo-constants";
import React from "react";
import { StyleSheet } from "react-native";
import { Ionicons, Text, TouchableOpacity, View } from "./Themed";
import { useNavigation } from "@react-navigation/native";
import Icon from "./Icon";
import { tintIndigo } from "../constants/Colors";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  children?: any;
  containerStyle?: any;
  handleBackBtn?: Function;
  showBackButtom?: boolean;
  showCloseButtom?: boolean;
  disableBackButtom?: boolean;
  backButtonStyle?: any;
  title?: string;
  backButtonColor?: string;
  showDoneButton?: boolean;
  handleDoneBtn?: () => void;
  doneBtnColor?: string;
};
// @ts-ignore
export default function Navbar({
  children,
  containerStyle,
  handleBackBtn,
  showBackButtom = true,
  backButtonStyle,
  title,
  showCloseButtom = false,
  backButtonColor,
  showDoneButton = false,
  handleDoneBtn,
  doneBtnColor,
}: Props) {
  const navigation = useNavigation();
  const showDoneBtnDerivedValue = useDerivedValue(
    () => (showDoneButton ? 1 : 0),
    [showDoneButton]
  );
  const handleBackButton = () => {
    if (handleBackBtn) {
      handleBackBtn();
    } else {
      navigation.goBack();
    }
  };

  const style = useAnimatedStyle(() => {
    return {
      opacity: withSpring(showDoneBtnDerivedValue.value),
    };
  });
  return (
    <View style={[styles.header, containerStyle]}>
      {(showBackButtom || showCloseButtom) && (
        <Icon
          name={showBackButtom ? "chevron-back" : "close"}
          size={30}
          onPress={handleBackButton}
          style={[backButtonStyle, {paddingLeft: 10}]}
          color={backButtonColor}
        />
      )}
      {title && (
        <Text style={{ textAlign: "center" }} text="semiBoldbodyText">
          {title}
        </Text>
      )}
      {children ? children : null}
      <Animated.View
        style={[style, {paddingRight:10}]}
      >
        <Icon
          size={30}
          name="checkmark-sharp"
          onPress={handleDoneBtn}
          color={doneBtnColor}
        />
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    width: "100%",
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "space-between",
  },
});
