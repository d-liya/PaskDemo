import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { Notification, Status } from "../types";

interface NotificationState {
  notifications: Notification[];
  notificationToken: string;
  notification?: Notification;
  status: Status;
}

const initialState: NotificationState = {
  notifications: [],
  notificationToken: "",
  status: "idle",
};

const notification = createSlice({
  name: "notification",
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
    handleSetNotification: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
    handleSetNotificationToken: (state, action: PayloadAction<string>) => {
      state.notificationToken = action.payload;
    },
    handleNewNotification: (
      state,
      action: PayloadAction<Notification | undefined>
    ) => {
      state.notification = action.payload;
    },
    handleNotificationStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
  },
});

export const {
  handleValueChange,
  handleSetNotification,
  handleNewNotification,
  handleSetNotificationToken,
  handleNotificationStatus,
} = notification.actions;

export const useUpdateValue = () => {
  const dispatch = useAppDispatch();
  return (elementName: string, elementValue: string) =>
    dispatch(handleValueChange({ elementName, elementValue }));
};
export const useUpdateNotification = () => {
  const dispatch = useAppDispatch();
  return (e: Notification[]) => dispatch(handleSetNotification(e));
};
export const useUpdateNotificationToken = () => {
  const dispatch = useAppDispatch();
  return (e: string) => dispatch(handleSetNotificationToken(e));
};
export const useUpdateNewNotification = () => {
  const dispatch = useAppDispatch();
  return (e: Notification | undefined) => dispatch(handleNewNotification(e));
};
export const useUpdateNotificationStatus = () => {
  const dispatch = useAppDispatch();
  return (e: Status) => dispatch(handleNotificationStatus(e));
};

export const useNotificationtore = () =>
  useAppSelector((state) => state.notification);

export default notification.reducer;
