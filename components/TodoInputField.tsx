import React, { useState } from "react";
import { StyleSheet, TextInput as RNTextInput } from "react-native";
import Colors, { defaultColor, tintIndigo } from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Icon from "./Icon";
import { TextInputProps, TouchableOpacity, View, TextInput } from "./Themed";

export default function TodoInputField({
  completed,
  ...props
}: TextInputProps & {
  completed?: boolean;
  keyBoardRef?: React.Ref<RNTextInput>;
}) {
  const colorTheme = useColorScheme();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.bullet,
          { borderColor: Colors[colorTheme].border },
          completed && {
            borderColor: "rgb(255,149,0)",
            borderWidth: 2,
            backgroundColor: "rgb(255,149,0)",
          },
        ]}
        onPress={() => console.log("not implemented")}
      />
      {completed && (
        <Icon
          size={30}
          name="checkmark-sharp"
          style={{
            position: "absolute",
            backgroundColor: "transparent",
            top: 10,
          }}
          color={tintIndigo}
        />
      )}
      <TextInput
        {...props}
        style={[styles.input, { borderColor: Colors[colorTheme].border }]}
        multiline
        ref={props.keyBoardRef}
        editable={!completed}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bullet: {
    width: 21,
    height: 21,
    borderRadius: 5,
    marginRight: 15,
    borderWidth: 1,
  },
  input: {
    paddingVertical: 12,
    borderBottomWidth: 0.7,
    flex: 1,
    fontSize: 15,
    marginVertical: 5,
  },
});
