import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import {
  useAuthStore,
  handleAuthStatus,
  handleAccessToken,
  handleUUID,
} from "../redux/authSlice";

import CreateTodoScreen from "../screens/CreateTodoScreen";
import GetStartedScreen from "../screens/GetStartedScreen";
import HomeScreen from "../screens/HomeScreen";
import ListTodoScreen from "../screens/ListTodoScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SettingsScreen from "../screens/SettingsScreen";

import { AuthTypes, NewtWorkTypes, RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import NetInfo from "@react-native-community/netinfo";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../methods/initFIrebase";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "../screens/LoadingScreen";
import { useSecureStore } from "../hooks/useSecureStore";
import { GithubStorageKey } from "../constants/Common";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "../hooks/useRedux";
import { useTodoStore } from "../redux/todoSlice";
import useFireStore from "../hooks/useFireStore";
import NotificationBar from "../components/NotificationBar";
import * as Notifications from "expo-notifications";
import { useUpdateNewNotification } from "../redux/notificationSlice";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const dispatch = useAppDispatch();
  const [netStatus, setNetStatus] = React.useState<NewtWorkTypes>("loading");
  const { attemptToRestoreAuthAsync } = useAuth();
  const { getValuesFor, save } = useSecureStore();
  const { todos } = useTodoStore();
  const { setDocument } = useFireStore();
  const setNewNotification = useUpdateNewNotification();
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetStatus("loading");
      if (state.isInternetReachable === null) return;
      if (!state.isInternetReachable) {
        setNetStatus("offline");
      } else {
        setNetStatus("online");
      }
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (netStatus === "loading") return;
    if (netStatus === "offline") {
      dispatch(handleAuthStatus("offline"));
      return;
    }
    const unsubsribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getValuesFor(GithubStorageKey);
        if (token) {
          dispatch(handleAccessToken(token));
          dispatch(handleUUID(user.uid));
          dispatch(handleAuthStatus("loggedIn"));
        }
      } else {
        attemptToRestoreAuthAsync()
          .then((result) => {
            // If no token is found in the keychain
            if (result === undefined) {
              dispatch(handleAuthStatus("loggedOut"));
            }
          })
          .catch((error) => {
            console.log(error);

            dispatch(handleAuthStatus("loggedOut"));
          });
      }
    });
    return () => unsubsribe();
  }, [netStatus]);

  React.useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        const { title, body } = notification.request.content;
        setNewNotification({
          title: title || "",
          text: body || "",
          completedAt: new Date().getTime().toString(),
          id: notification.date,
        });
      }
    );
    return () => notificationListener.remove();
  }, []);

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <NotificationBar />
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { status } = useAuthStore();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* {status === "loading" && (
        <Stack.Screen
          options={{ presentation: "modal" }}
          name="Loading"
          component={LoadingScreen}
        />
      )} */}
      {(status === "loggedIn" || status === "offline") && (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ListTodo" component={ListTodoScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="CreateTodo" component={CreateTodoScreen} />
          </Stack.Group>
        </>
      )}
      {(status === "loggedOut" || status === "loading") && (
        <Stack.Screen
          name="GetStarted"
          component={GetStartedScreen}
          options={{
            animationTypeForReplace: status === "loggedOut" ? "pop" : "push",
          }}
        />
      )}
    </Stack.Navigator>
  );
}
