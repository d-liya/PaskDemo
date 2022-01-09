import React from "react";
import { useModalStore } from "../redux/modalSlice";
import { ModalNames } from "../types";
import ConfirmationModal from "./ConfirmationModal";

export default function ConfModalWithStore({
  onLeftBtnPress,
  onRightBtnPress,
  onBtnPress,
  modalName,
}: {
  onLeftBtnPress?: () => void;
  onRightBtnPress?: () => void;
  onBtnPress?: () => void;
  modalName: ModalNames;
}) {
  const {
    message,
    leftBtnText,
    rightBtnText,
    leftBtnColor,
    rightBtnColor,
    activeModalName,
    btnColor,
    btnText,
    leftBtnBold,
    loading,
    messageColor,
  } = useModalStore();
  return (
    <ConfirmationModal
      {...{
        message,
        leftBtnText,
        rightBtnText,
        leftBtnColor,
        rightBtnColor,
        onLeftBtnPress,
        onRightBtnPress,
        btnColor,
        btnText,
        onBtnPress,
        leftBtnBold,
        loading,
        messageColor,
      }}
      isOpen={modalName === activeModalName}
    />
  );
}
