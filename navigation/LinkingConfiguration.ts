import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Home: "home",
      ListTodo: "list",
      Notifications: "notifications",
      Settings: "settings",
      CreateTodo: "create",
      GetStarted: "start",
      Loading: "loading",
      NotFound: "*",
    },
  },
};

export default linking;
