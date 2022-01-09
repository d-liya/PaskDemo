import React from "react";
import { TextInput, TextInputProps } from "./Themed";

export default function TextInputField(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      style={{
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        fontSize: 16,
      }}
      tintColor
    />
  );
}
