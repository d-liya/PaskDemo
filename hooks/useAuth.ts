import {
  AuthSessionResult,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
import {
  GithubAuthProvider,
  signInWithCredential,
  signOut,
  UserCredential,
} from "firebase/auth";
import {
  GithubStorageKey,
  GITHUB_CRED,
  GITHUB_DISCOVERY,
  GITHUB_SCOPE,
} from "../constants/Common";
import getGithubTokenAsync from "../methods/getGitHubTokenAsync";
import { auth } from "../methods/initFIrebase";
import useFireStore from "./useFireStore";
import { useSecureStore } from "./useSecureStore";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
const SCHEME = Constants.manifest?.scheme;
WebBrowser.maybeCompleteAuthSession();
const USE_PROXY = Platform.select({
  web: false,
  default: Constants.appOwnership === "standalone" ? false : true,
});
const REDIRECT_URI = makeRedirectUri({
  useProxy: USE_PROXY,
  native: `com.dliya.pask://redirect`,
});

export default function useAuth() {
  const { save, getValuesFor, remove } = useSecureStore();
  const { setDocument, getDocument } = useFireStore();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GITHUB_CRED.id,
      scopes: GITHUB_SCOPE,
      redirectUri: REDIRECT_URI,
      extraParams: {
        // On Android it will just skip right past sign in otherwise
        show_dialog: "true",
      },
    },
    GITHUB_DISCOVERY
  );

  async function signInAsync(token?: string): Promise<{
    githubToken?: string;
    user?: UserCredential["user"];
    message?: string;
    type: string;
  }> {
    try {
      if (!token) {
        const response = await promptAsync({ useProxy: USE_PROXY });

        const { type, access_token, error, message } =
          await getGithubTokenAsync(response, REDIRECT_URI);
        if (type === "success" && access_token) {
          await save(GithubStorageKey, access_token);
          return signInAsync(access_token);
        } else {
          await setDocument(
            {
              mone: "token not found",
              re: REDIRECT_URI,
              error: error ? error : "",
              message: message ? message : "",
              type,
            },
            "temp",
            "1553"
          );
          return {
            type: "error",
            message: "No token found",
          };
        }
      }
      const credential = GithubAuthProvider.credential(token);
      const res = await signInWithCredential(auth, credential);
      return {
        githubToken: token,
        user: res.user,
        type: "success",
      };
    } catch ({ message }) {
      console.log(message);
      await remove(GithubStorageKey);
      await signOutAsync();
      return {
        message: "Something went wrong",
        type: "error",
      };
    }
  }

  async function signOutAsync() {
    try {
      await remove(GithubStorageKey);
      await signOut(auth);
    } catch ({ message }) {
      console.log(message);
    }
  }

  async function attemptToRestoreAuthAsync() {
    let token = await getValuesFor(GithubStorageKey);
    if (token) {
      console.log("Token found in the storage", token);
      return signInAsync(token);
    }
  }
  return {
    signInAsync,
    signOutAsync,
    attemptToRestoreAuthAsync,
  };
}
