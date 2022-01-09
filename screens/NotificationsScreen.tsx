import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Navbar from "../components/NavBar";
import {
  SafeAreaViewWithFlex,
  ScrollView,
  Text,
  TextInput,
  View,
} from "../components/Themed";
import TodoInputField from "../components/TodoInputField";
import { tintIndigo } from "../constants/Colors";
import { RootStackScreenProps } from "../types";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import NotificationCard from "../components/NotificationCard";
import {
  useNotificationtore,
  useUpdateNotification,
  useUpdateNotificationStatus,
} from "../redux/notificationSlice";
import Constants from "expo-constants";
import useFireStore from "../hooks/useFireStore";
import ActivityIndicator from "../components/ActivityIndicator";

export default function NotificationsScreen({
  navigation,
}: RootStackScreenProps<"Notifications">) {
  const store = useNotificationtore();
  const scrollY = useSharedValue(0);
  const { getDocument } = useFireStore();
  const setNotifications = useUpdateNotification();
  const setNotificationStatus = useUpdateNotificationStatus();

  const onScroll = useAnimatedScrollHandler((event, ctx) => {
    scrollY.value = event.contentOffset.y;
  });
  const headerStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 80],
      [0, 1],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 80],
      [10, 0],
      Extrapolate.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });
  const fetchNotifications = async () => {
    setNotificationStatus("loading");
    try {
      const notifications = await getDocument("notifications");
      if (notifications.exists()) {
        const data = Object.values(notifications.data());
        setNotifications(data);
      } else {
        setNotifications([]);
      }
      setNotificationStatus("success");
    } catch (error) {
      setNotificationStatus("error");
    }
  };

  React.useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <SafeAreaViewWithFlex style={styles.container}>
      <Navbar showBackButtom containerStyle={{ paddingTop: 15 }} />
      <Animated.View style={[styles.navbarHeader, headerStyles]}>
        <Text text="semiBoldbodyText">Notifications</Text>
      </Animated.View>

      <Animated.ScrollView
        {...{ onScroll }}
        scrollEventThrottle={1}
        style={styles.scrollView}
      >
        <Text text="boldMediumTitle" style={styles.header}>
          Notifications
        </Text>
        {store.status === "success" &&
          store.notifications.map((notification, index) => (
            <NotificationCard
              key={index}
              text={notification.text}
              completedAt={notification.completedAt}
              id={notification.id}
              title={notification.title}
            />
          ))}
        {store.status === "loading" && (
          <View style={styles.emptyContainer}>
            <ActivityIndicator />
          </View>
        )}
        {store.status !== "loading" && store.notifications.length <= 0 && (
          <View style={styles.emptyContainer}>
            <Text
              text="secondaryText"
              color={tintIndigo}
              style={{ textAlign: "center" }}
            >
              You don't have any notifications yet.
            </Text>
          </View>
        )}
      </Animated.ScrollView>
    </SafeAreaViewWithFlex>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  navbarHeader: {
    zIndex: 100,
    position: "absolute",
    alignSelf: "center",
    top: Constants.statusBarHeight + 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 16,
  },
});
