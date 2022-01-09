import React, { useEffect } from "react";
import { Dimensions, Platform, StyleSheet } from "react-native";
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "./Themed";
import Constants from "expo-constants";
import {
  useNotificationtore,
  useUpdateNewNotification,
} from "../redux/notificationSlice";
import { tintIndigo } from "../constants/Colors";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { SPRING_CONFIG } from "../constants/Common";
import { useNavigation } from "@react-navigation/native";
const windowHeight =
  Platform.OS == "ios"
    ? Dimensions.get("window").height
    : Dimensions.get("screen").height;
export default function NotificationBar() {
  const translateY = useSharedValue(-100);
  const { notification } = useNotificationtore();
  const setNewNotification = useUpdateNewNotification();
  const navigate = useNavigation();

  useEffect(() => {
    if (notification) {
      translateY.value = 0;
    }
  }, [notification]);
  const _style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(translateY.value),
        },
      ],
    };
  });
  const removeNotification = () => {
    setNewNotification(undefined);
    translateY.value = -100;
  };
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx: { offsetY: number }) => {
      ctx.offsetY = translateY.value;
    },
    onActive: (event, ctx) => {
      if (ctx.offsetY + event.translationY < 50) {
        translateY.value = ctx.offsetY + event.translationY;
      }
    },
    onEnd: ({ velocityY, absoluteY, velocityX }, ctx) => {
      if (translateY.value > 0) {
        translateY.value = 0;
      } else {
        if (velocityY < -250 || translateY.value < -10) {
          translateY.value = -100;
          runOnJS(removeNotification)();
        }
      }
    },
  });
  const handleOnPress = () => {
    navigate.navigate("ListTodo", { id: notification!.id });
    removeNotification();
  };

  return (
    <PanGestureHandler {...{ onGestureEvent }}>
      <Animated.View style={[styles.inner, _style]}>
        <TouchableWithoutFeedback onPress={handleOnPress}>
          <View style={styles.container}>
            <View style={[styles.circle]} />
            <View style={styles.middle}>
              <Text color="white" text="semiBoldbodyText">
                {notification ? notification.title : ""}
              </Text>
              <Text color="white" text="secondaryText">
                {notification ? notification.text : ""}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </PanGestureHandler>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Constants.statusBarHeight,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 10,
    backgroundColor: tintIndigo,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
  },
  circle: {
    backgroundColor: "rgb(255,149,0)",
    width: 30,
    height: 30,
    borderRadius: 30 / 3,
  },
  middle: {
    backgroundColor: tintIndigo,
    width: "80%",
    paddingHorizontal: 10,
  },
  inner: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: tintIndigo,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
  },
});
