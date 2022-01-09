import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Home: undefined;
  ListTodo: { id: number };
  Notifications: undefined;
  Settings: undefined;
  CreateTodo: undefined;
  GetStarted: undefined;
  NotFound: undefined;
  Loading: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type Todos = {
  title: string;
  description: string;
  todos: Todo[];
  id: number;
  url?: string;
  sha?: string;
};

export type Todo = {
  text: string;
  completed?: boolean;
  createdAt: string;
  completedAt?: string;
  id: number;
};

export type Notification = {
  title: string;
  text: string;
  completedAt: string;
  id: number;
};

export type GitHubProject = {
  name: string;
  description: string;
  url: string;
  id: number;
  fork?: boolean;
  private?: boolean;
  owner: { login: string };
};

export type AuthTypes = "loading" | "loggedIn" | "loggedOut" | "offline";
export type NewtWorkTypes = "loading" | "offline" | "online";
export type ModalNames =
  | "SIGNOUT"
  | "DELETE_TODO"
  | ""
  | "INFO"
  | "SIGNINAGAIN"
  | "CREATETODO"
  | "GETSTARTED";

export type Status = "loading" | "success" | "error" | "idle";
