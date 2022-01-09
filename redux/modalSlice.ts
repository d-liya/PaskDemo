import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { ModalNames } from "../types";

interface ModalState {
  message?: string;
  leftBtnText?: string;
  rightBtnText?: string;
  leftBtnColor?: string;
  rightBtnColor?: string;
  btnText?: string;
  btnColor?: string;
  activeModalName: ModalNames;
  leftBtnBold?: boolean;
  loading?: boolean;
  messageColor?: string;
}

const initialState: ModalState = {
  message: "",
  leftBtnText: "",
  rightBtnText: "",
  leftBtnColor: "",
  rightBtnColor: "",
  activeModalName: "",
  btnColor: "",
  btnText: "",
};

const modal = createSlice({
  name: "modal",
  initialState,
  reducers: {
    handleModalOpen: (state, action: PayloadAction<ModalState>) => {
      state.message = action.payload.message;
      state.leftBtnText = action.payload.leftBtnText;
      state.rightBtnText = action.payload.rightBtnText;
      state.leftBtnColor = action.payload.leftBtnColor;
      state.rightBtnColor = action.payload.rightBtnColor;
      state.activeModalName = action.payload.activeModalName;
      state.btnText = action.payload.btnText;
      state.btnColor = action.payload.btnColor;
      state.leftBtnBold = action.payload.leftBtnBold;
      state.loading = action.payload.loading;
      state.messageColor = action.payload.messageColor;
    },
    handleModalClose: (state) => {
      return initialState;
    },
  },
});

export const { handleModalClose, handleModalOpen } = modal.actions;

export const useOpenModal = () => {
  const dispatch = useAppDispatch();
  return (e: ModalState) => dispatch(handleModalOpen(e));
};

export const useCloseModal = () => {
  const dispatch = useAppDispatch();
  return () => dispatch(handleModalClose());
};

export const useModalStore = () => useAppSelector((state) => state.modal);

export default modal.reducer;
