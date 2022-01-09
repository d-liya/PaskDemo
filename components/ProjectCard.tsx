import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import Colors, { red, tintIndigo } from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { Todos } from "../types";
import ProgressBar from "./ProgressBar";
import SwipeableRow from "./Swipeable";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  Ionicons,
} from "./Themed";

export default function ProjectCard({
  title,
  description,
  id,
  todos,
  handleDelete,
  ...props
}: Todos & TouchableOpacityProps & { handleDelete: Function }) {
  const colorTheme = useColorScheme();
  const navigate = useNavigation();
  const completed = todos.filter((todo) => todo.completed).length;

  const renderLeftActions = () => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          position: "absolute",
          right: 0,
          alignSelf: "center",
          zIndex: -10,
          justifyContent: "flex-end",
          padding: 10,
          borderRadius: 10,
        }}
        tintColor
        onPress={() => handleDelete()}
      >
        <Ionicons name="trash" color={red} size={35} />
      </TouchableOpacity>
    );
  };
  return (
    <SwipeableRow index={id} rightView={renderLeftActions} rightSnapPoint={70}>
      <TouchableWithoutFeedback
        onPress={() => navigate.navigate("ListTodo", { id })}
        isHaptic
        {...props}
      >
        <View
          style={[styles.container, { shadowColor: Colors[colorTheme].tint }]}
        >
          <View style={styles.firstHalf}>
            <View style={styles.circle} />
            <View style={styles.middle}>
              <Text
                text="semiBoldbodyText"
                style={styles.header}
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text text="secondaryText" numberOfLines={1}>
                {description}
              </Text>
            </View>
          </View>
          {todos.length > 0 && (
            <ProgressBar total={todos.length} completed={completed} />
          )}
        </View>
      </TouchableWithoutFeedback>
    </SwipeableRow>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    justifyContent: "space-between",
    flexShrink: 1,
  },
  circle: {
    backgroundColor: "rgb(255,149,0)",
    width: 50,
    height: 50,
    borderRadius: 50 / 3,
  },
  header: {
    paddingBottom: 4,
  },
  middle: {
    paddingHorizontal: 10,
    flexShrink: 1,
  },
  firstHalf: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
});
