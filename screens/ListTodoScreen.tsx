import React, { useCallback, useEffect, useLayoutEffect } from "react";
import { Keyboard, StyleSheet, TextInput } from "react-native";
import Navbar from "../components/NavBar";
import {
  KeyboardAvoidingView,
  SafeAreaViewWithFlex,
  Text,
  TouchableWithoutFeedback,
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
import { useIsUpdate, useTodoStore, useUpdateTodos } from "../redux/todoSlice";
import useKeyBoardVisible from "../hooks/useKeyBoardVisible";
import Icon from "../components/Icon";
import Constants from "expo-constants";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import useIsAppStateVisible from "../hooks/useIsAppStateVisible";
import { useSecureStore } from "../hooks/useSecureStore";
import useFireStore from "../hooks/useFireStore";
import * as WebBrowser from "expo-web-browser";
import { useFileSystem } from "../hooks/useFileSystem";
import { useAuthStore } from "../redux/authSlice";
import { sycnedStorageKey } from "../constants/Common";

export default function ListTodoScreen({
  route,
  navigation,
}: RootStackScreenProps<"ListTodo">) {
  const scrollY = useSharedValue(0);
  const store = useTodoStore();
  const { id } = route.params;
  const updateTodo = useUpdateTodos();
  const isKeyBoardVisible = useKeyBoardVisible();
  const keyBoardRef: React.Ref<TextInput> = React.useRef(null);
  const emptyTodoRef = React.useRef(false);
  const childRef = React.useRef(false);
  const scrollRef = React.useRef<Animated.ScrollView>(null);
  const isAppStateVisible = useIsAppStateVisible();
  const { save } = useSecureStore();
  const { setDocument } = useFireStore();
  const setIsUpdate = useIsUpdate();
  const { writeFile } = useFileSystem();
  const { status } = useAuthStore();
  const todos = React.useMemo(
    () => store.todos.find((el) => el.id === id),
    [store.todos, id]
  );
  useEffect(() => {
    if (!todos) {
      navigation.goBack();
    }
  }, [todos]);
  const handleChangeText = (text: string, todoID: number) => {
    if (todos) {
      const findTodo = todos.todos.findIndex((el) => el.id === todoID);
      if (findTodo !== -1) {
        const newTodo = [...todos.todos];
        newTodo[findTodo] = { ...newTodo[findTodo], text };
        const newTodos = [...store.todos];
        const findTodos = newTodos.findIndex((el) => el.id === id);
        if (findTodos !== -1) {
          newTodos[findTodos] = { ...newTodos[findTodos], todos: newTodo };
          updateTodo(newTodos);
          setIsUpdate(true);
        }
      }
    }
  };

  useEffect(() => {
    if (
      isAppStateVisible === "background" ||
      isAppStateVisible === "inactive"
    ) {
      syncTodo();
    }
  }, [isAppStateVisible]);

  const syncTodo = async () => {
    try {
      // Don't sync if nothing changed
      if (!store.isUpdate) return;
      await writeFile("todos", JSON.stringify(store.todos));
      await save(sycnedStorageKey, "false");
      if (status === "loggedIn") {
        await setDocument({ todos: store.todos }, "todos");
        await save(sycnedStorageKey, "true");
      }
      console.log("Synced");

      setIsUpdate(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addNewTodo = () => {
    if (todos) {
      const newTodo = [
        ...todos.todos,
        {
          id: new Date().getTime(),
          text: "",
          createdAt: new Date().toISOString(),
        },
      ];
      const newTodos = [...store.todos];
      const findTodos = newTodos.findIndex((el) => el.id === id);
      if (findTodos !== -1) {
        newTodos[findTodos] = { ...newTodos[findTodos], todos: newTodo };
        updateTodo(newTodos);
        emptyTodoRef.current = true;
      }
    }
  };

  const removeEmptyTodo = () => {
    if (todos) {
      const newTodo = todos.todos.filter((el) => el.text !== "");
      const newTodos = [...store.todos];
      const findTodos = newTodos.findIndex((el) => el.id === id);
      if (findTodos !== -1) {
        newTodos[findTodos] = { ...newTodos[findTodos], todos: newTodo };
        updateTodo(newTodos);
        emptyTodoRef.current = false;
      }
    }
  };

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

  useEffect(() => {
    keyBoardRef.current && emptyTodoRef.current && keyBoardRef.current.focus();
  }, [emptyTodoRef.current]);

  useEffect(() => {
    if (!isKeyBoardVisible) {
      removeEmptyTodo();
    } else {
      if (scrollRef && scrollRef.current) {
        // @ts-ignore
        scrollRef.current.scrollToEnd({ animated: true });
      }
    }
  }, [isKeyBoardVisible]);
  const handleOpenInBrowser = (link: string) => {
    WebBrowser.openBrowserAsync(link);
  };
  return todos ? (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <SafeAreaViewWithFlex style={styles.container}>
        <Navbar
          showBackButtom
          containerStyle={{ paddingTop: 15 }}
          showDoneButton={isKeyBoardVisible}
          handleDoneBtn={() => Keyboard.dismiss()}
          doneBtnColor={tintIndigo}
        />
        <Animated.View style={[styles.navbarHeader, headerStyles]}>
          <Text text="semiBoldbodyText">{todos?.title}</Text>
        </Animated.View>
        <Animated.ScrollView
          {...{ onScroll }}
          scrollEventThrottle={1}
          ref={scrollRef}
          style={styles.scrollView}
          onTouchStart={() => {
            childRef.current = true;
          }}
          onContentSizeChange={() => {
            // @ts-ignore
            scrollRef.current.scrollToEnd({ animated: false });
          }}
          onTouchEnd={() => {
            // Checks if there are no emptytodos and if the touch is outside of the
            // child content and the keyboard is hidden we add an emmpty todo.
            if (
              !emptyTodoRef.current &&
              childRef.current &&
              !isKeyBoardVisible
            ) {
              addNewTodo();
            }
          }}
        >
          <Text text="boldMediumTitle" style={styles.header}>
            {todos?.title}
          </Text>
          <View
            onTouchStart={() => (childRef.current = true)}
            onTouchEnd={() => (childRef.current = false)}
          >
            {todos.todos instanceof Array &&
              todos.todos.length > 0 &&
              todos.todos.map((todo, i) => (
                <TodoInputField
                  key={todo.id}
                  value={todo.text}
                  completed={todo.completed}
                  onChangeText={(text) => handleChangeText(text, todo.id)}
                  // Here to get the focus on the last todo when created.
                  keyBoardRef={todo.text === "" ? keyBoardRef : null}
                />
              ))}
            {todos.todos.length <= 0 && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 20,
                }}
              >
                <Text text="semiBoldbodyText" color={tintIndigo}>
                  No Tasks Yet
                </Text>
                <Text
                  text="secondaryText"
                  color={tintIndigo}
                  style={{ textAlign: "center" }}
                >
                  Just tap the plus sign to add your first tasks. To tick off a
                  task you will have to include the task you completed in a
                  commit message following "-C" or one of our keywords.
                </Text>
                <TouchableWithoutFeedback
                  onPress={() =>
                    handleOpenInBrowser(
                      "https://pask-6f72b.web.app/faq?goToKeywords=true"
                    )
                  }
                >
                  <Text
                    text="secondaryText"
                    style={{ textAlign: "center", paddingVertical: 5 }}
                  >
                    Learn More
                  </Text>
                </TouchableWithoutFeedback>
                <Text
                  text="secondaryText"
                  style={{ textAlign: "center" }}
                  color={tintIndigo}
                >
                  For example: "-C Added my first task." It doesn't have to be
                  exaclty same make sure to include a few similar words in your
                  commit message.
                </Text>
              </View>
            )}
          </View>
        </Animated.ScrollView>
        <View
          style={[
            styles.bottomContainer,
            { display: emptyTodoRef.current ? "none" : "flex" },
          ]}
        >
          <Icon
            name="add-circle"
            style={{ paddingHorizontal: 5 }}
            onPress={addNewTodo}
            size={35}
            color={tintIndigo}
          />
        </View>
      </SafeAreaViewWithFlex>
    </KeyboardAvoidingView>
  ) : (
    <SafeAreaViewWithFlex />
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
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
});
