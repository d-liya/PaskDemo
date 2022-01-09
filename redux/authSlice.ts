import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { AuthTypes, NewtWorkTypes } from "../types";

interface AuthState {
  status: AuthTypes;
  accessToken: string;
  uuid: string;
  username?: string;
}

const initialState: AuthState = {
  status: "loading",
  accessToken: "",
  uuid: "",
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleValueChange: (
      state,
      action: PayloadAction<{
        elementName: string;
        elementValue: string;
      }>
    ) => {
      // @ts-ignore
      state[action.payload.elementName] = action.payload.elementValue;
    },
    handleAuthStatus: (state, action: PayloadAction<AuthTypes>) => {
      state.status = action.payload;
    },

    handleAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    handleUUID: (state, action: PayloadAction<string>) => {
      state.uuid = action.payload;
    },
    handleUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const {
  handleValueChange,
  handleAuthStatus,
  handleAccessToken,
  handleUUID,
  handleUsername,
} = auth.actions;

export const useUpdateValue = () => {
  const dispatch = useAppDispatch();
  return (elementName: string, elementValue: string) =>
    dispatch(handleValueChange({ elementName, elementValue }));
};
export const useUpdateAuthStatus = () => {
  const dispatch = useAppDispatch();
  return (e: AuthTypes) => dispatch(handleAuthStatus(e));
};

export const useUpdateUUID = () => {
  const dispatch = useAppDispatch();
  return (e: string) => dispatch(handleUUID(e));
};

export const useUpdateUserName = () => {
  const dispatch = useAppDispatch();
  return (e: string) => dispatch(handleUsername(e));
};

export const useAuthStore = () => useAppSelector((state) => state.auth);

export default auth.reducer;
