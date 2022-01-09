import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { StyleSheet, Platform } from "react-native";
import Icon from "../components/Icon";
import ProjectCard from "../components/ProjectCard";
import { SafeAreaViewWithFlex, Text, View } from "../components/Themed";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { RootStackParamList, RootStackScreenProps, Todos } from "../types";
import Navbar from "../components/NavBar";
import { red, tintIndigo } from "../constants/Colors";
import { useSecureStore } from "../hooks/useSecureStore";
import {
  useDeleteID,
  useIsUpdate,
  useTodoStatus,
  useTodoStore,
  useUpdateTodos,
} from "../redux/todoSlice";
import ConnectivityBar from "../components/ConnectivityBar";
import { useAuthStore, useUpdateUserName } from "../redux/authSlice";
import ConfModalWithStore from "../components/ConfModalWithStore";
import useAuth from "../hooks/useAuth";
import { useCloseModal, useOpenModal } from "../redux/modalSlice";
import useFireStore from "../hooks/useFireStore";
import useIsAppStateVisible from "../hooks/useIsAppStateVisible";
import LoadingBar from "../components/LoadingBar";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import ActivityIndicator from "../components/ActivityIndicator";
import {
  useNotificationtore,
  useUpdateNewNotification,
} from "../redux/notificationSlice";
import { SwipeProvider } from "../components/SwipeableContext";
import useGitHubApi from "../hooks/useGitHubApi";
import { getworkFlowUrl } from "../methods/getWorkflowYAML";
import {
  pushNotificationStorageKey,
  sycnedStorageKey,
} from "../constants/Common";
import { useFileSystem } from "../hooks/useFileSystem";

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      // "Failed to get push token for push notification!"
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    // "Must use physical device for Push Notifications"
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default function HomeScreen({
  navigation,
}: RootStackScreenProps<"Home">) {
  const navigate = useNavigation();
  const { getValuesFor, save } = useSecureStore();
  const store = useTodoStore();
  const { status, username } = useAuthStore();
  const setTodo = useUpdateTodos();
  const openModal = useOpenModal();
  const closeModal = useCloseModal();
  const { getDocument } = useFireStore();
  const isAppStateVisible = useIsAppStateVisible();
  const setTodoStatus = useTodoStatus();
  const setNewNotification = useUpdateNewNotification();
  const { setDocument } = useFireStore();
  const [isFocused, setFocus] = useState(false);
  const setDeleteTodoId = useDeleteID();
  const { remove } = useGitHubApi();
  const setUserName = useUpdateUserName();
  const setIsUpdate = useIsUpdate();
  const isFocusedScreen = useIsFocused();
  const { writeFile, readFile } = useFileSystem();
  const handleIconPress = (name: keyof RootStackParamList) => {
    navigate.navigate(name);
  };

  const scrollY = useSharedValue(0);
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
  const setPushToken = async (token: string | undefined) => {
    try {
      if (!token) return;
      const _localToken = await getValuesFor(pushNotificationStorageKey);
      if (_localToken === token) return;
      await save(pushNotificationStorageKey, token);
      await setDocument({ pushToken: token }, `users`);
    } catch (error) {}
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setPushToken(token));
    // when user clicks on a notification
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { data } = response.notification.request.content;
        if (data.id) {
          navigate.navigate("ListTodo", {
            // @ts-ignore
            id: parseInt(data.id),
          });
        }
      });

    return () => {
      responseListener.remove();
    };
  }, []);
  const syncTodo = async () => {
    try {
      // Don't sync if nothing changed
      if (!store.isUpdate) return;

      await writeFile("todos", JSON.stringify(store.todos));
      await save(sycnedStorageKey, "false");
      await setDocument({ todos: store.todos }, "todos");
      await save(sycnedStorageKey, "true");
      console.log("Synced");

      setIsUpdate(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isFocusedScreen) {
      syncTodo();
    }
  }, [isFocusedScreen]);

  useEffect(() => {
    // while the user is using the app
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const { title, body, data } = notification.request.content;
        setNewNotification({
          title: title || "",
          text: body || "",
          completedAt: new Date().getTime().toString(),
          // @ts-ignore
          id: parseInt(data.id),
        });
        fetchTodos();
      }
    );
    return () => subscription.remove();
  }, []);

  const fetchTodosFromLocalStroage = async () => {
    const todos = await readFile("todos");
    if (todos) {
      return JSON.parse(todos);
    } else {
      console.log("No todos found in device");
    }
  };

  const fetchTodosFromFireStore = async () => {
    const todos = await getDocument("todos");
    if (todos.exists()) {
      return todos.data().todos;
    } else {
      console.log("No todos found in database");
    }
  };

  const fetchUserNameFromFireStore = async () => {
    const user = await getDocument("users");
    if (user.exists()) {
      return user.data().login;
    } else {
      console.log("No user found in database");
    }
  };

  const mergeTodos = (local: Todos[], foreign: Todos[]) => {
    if (!local || (local instanceof Array && local.length === 0))
      return foreign;
    if (!foreign || (foreign instanceof Array && foreign.length === 0))
      return [];

    if (local.length !== foreign.length) return foreign;

    const newTodos: Todos[] = [];
    for (let f of foreign) {
      for (let l of local) {
        if (f.id === l.id) {
          const _newTodos = l.todos.filter(
            (t) => !f.todos.find((t2) => t2.id === t.id)
          );
          newTodos.push({ ...l, ...{ todos: [...f.todos, ..._newTodos] } });
        } else {
          newTodos.push(f);
        }
      }
    }
    return newTodos;
  };
  const fetchTodos = async () => {
    setTodoStatus("loading");
    try {
      let _todos;
      const isSynced = await getValuesFor(sycnedStorageKey);
      _todos = await fetchTodosFromLocalStroage();
      if (status === "loggedIn") {
        const databaseTodos: Todos[] = await fetchTodosFromFireStore();
        if (isSynced === "true") {
          _todos = databaseTodos;
        } else {
          _todos = mergeTodos(_todos, databaseTodos);
        }
        const userName = await fetchUserNameFromFireStore();
        setUserName(userName);
      }
      if (_todos) {
        setTodo(_todos);
      }
      setTodoStatus("success");
    } catch (error) {
      setTodoStatus("error");
      console.log(error);

      openModal({
        message: "Opps! We ran in to an error. Please try again later.",
        activeModalName: "INFO",
        btnText: "Ok",
        btnColor: tintIndigo,
        messageColor: red,
      });
    }
  };
  useEffect(() => {
    if (isAppStateVisible === "active") {
      fetchTodos();
    }
  }, [isAppStateVisible, status]);

  useFocusEffect(
    useCallback(() => {
      setFocus(true);
      return () => setFocus(false);
    }, [setFocus])
  );
  const deleteGtiHubWorkFlow = async () => {
    const _todos = store.todos.find((todo) => todo.id === store.deleteId);
    if (_todos) {
      remove(
        getworkFlowUrl(_todos.title, username!),
        JSON.stringify({
          message: "Deleted the work flow file.",
          sha: _todos.sha,
        })
      );
    }
  };
  const deleteTodo = async () => {
    if (status !== "loggedIn") {
      openModal({
        message: "Cannot delete when you are in offline mode",
        activeModalName: "INFO",
        btnText: "Cancel",
        btnColor: red,
      });
    }
    openModal({
      loading: true,
      activeModalName: "INFO",
    });
    try {
      await deleteGtiHubWorkFlow();
      const _todos = store.todos.filter((todo) => todo.id !== store.deleteId);
      await setDocument({ todos: _todos }, "todos");
      await writeFile("todos", JSON.stringify(_todos));
      setTodo(_todos);
      setDeleteTodoId(0);
      closeModal();
    } catch (error) {
      openModal({
        message: "Opps! We ran in to an error. Please try again later.",
        activeModalName: "INFO",
        btnText: "OK",
        btnColor: red,
      });
    }
  };

  const handleDeleteTodo = (id: number) => {
    setDeleteTodoId(id);
    // Trick to close the swipeable
    setFocus((prev) => !prev);
    openModal({
      message: "Are you sure you want to delete this todo?",
      leftBtnText: "Delete",
      rightBtnText: "Cancel",
      leftBtnColor: red,
      activeModalName: "DELETE_TODO",
    });
  };
  return (
    <>
      <ConfModalWithStore onBtnPress={closeModal} modalName="INFO" />
      <ConfModalWithStore
        onLeftBtnPress={deleteTodo}
        onRightBtnPress={closeModal}
        modalName="DELETE_TODO"
      />
      <SafeAreaViewWithFlex>
        {status === "offline" && (
          <View>
            <ConnectivityBar
              style={{ position: "absolute", alignSelf: "center", top: 5 }}
            />
          </View>
        )}
        {store.status === "loading" && (
          <View>
            <LoadingBar
              style={{ position: "absolute", alignSelf: "center", top: 5 }}
            />
          </View>
        )}

        <Animated.View style={[headerStyles]}>
          <Navbar
            showBackButtom={false}
            title="Projects"
            containerStyle={styles.scrollContainer}
          >
            <View style={[styles.icons, { right: 16 }]}>
              <Icon
                name="notifications"
                style={{ paddingHorizontal: 5 }}
                onPress={() => handleIconPress("Notifications")}
                color={tintIndigo}
              />
              <Icon
                name="cog"
                style={{ paddingHorizontal: 5 }}
                onPress={() => handleIconPress("Settings")}
                size={28}
                color={tintIndigo}
              />
            </View>
          </Navbar>
        </Animated.View>
        <Animated.ScrollView
          style={styles.scrollContainer}
          {...{ onScroll }}
          scrollEventThrottle={1}
        >
          <View style={styles.navbar}>
            <Text text="boldMediumTitle">Projects</Text>
            <View style={styles.icons}>
              <Icon
                name="notifications"
                style={{ paddingHorizontal: 5 }}
                onPress={() => handleIconPress("Notifications")}
                color={tintIndigo}
              />
              <Icon
                name="cog"
                style={{ paddingHorizontal: 5 }}
                onPress={() => handleIconPress("Settings")}
                size={28}
                color={tintIndigo}
              />
            </View>
          </View>
          <SwipeProvider isFocusedScreen={isFocused}>
            <>
              {store.todos.length > 0 &&
                store.todos.map((todo, index) => (
                  <ProjectCard
                    key={index}
                    title={todo.title}
                    description={todo.description}
                    todos={todo.todos}
                    id={todo.id}
                    handleDelete={() => handleDeleteTodo(todo.id)}
                  />
                ))}
            </>
          </SwipeProvider>
          <View style={styles.emptyContainer}>
            {store.status === "loading" && store.todos.length <= 0 && (
              <ActivityIndicator />
            )}
            {store.status !== "loading" && store.todos.length <= 0 && (
              <>
                <Text text="semiBoldbodyText" color={tintIndigo}>
                  No Projects
                </Text>
                <Text
                  text="secondaryText"
                  color={tintIndigo}
                  style={{ textAlign: "center" }}
                >
                  You don't have any projects yet. Tap the plus sign below to
                  get started.
                </Text>
              </>
            )}
          </View>
        </Animated.ScrollView>

        <View style={styles.bottomContainer}>
          <Icon
            name="add-circle"
            style={{ paddingHorizontal: 5 }}
            onPress={() => handleIconPress("CreateTodo")}
            size={35}
            color={tintIndigo}
          />
        </View>
      </SafeAreaViewWithFlex>
    </>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  icons: {
    flexDirection: "row",
    position: "absolute",
    right: 0,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 16,
  },
});
