export const GithubStorageKey = "_githubtoken";
export const colorSchemeStorageKey = "_colorscheme";
export const sycnedStorageKey = "_synced";
export const pushNotificationStorageKey = "_pushnotification";

export const LIST_REPOS = "https://api.github.com/user/repos";
export const GITHUB_FILES = "https://api.github.com/repos/";
export const GITHUB_USER = "https://api.github.com/user/";
export const SERVER_URL = "https://vercel-todo-server.vercel.app/api/";
export const SPRING_CONFIG = {
  damping: 50,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
};
export const GITHUB_CRED = {
  id: "287713e84947f8d3601b",
};

export const GITHUB_DISCOVERY = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/<CLIENT_ID>",
};
export const GITHUB_SCOPE = ["repo", "workflow"];
export const text = [
  { text: "P", isInName: true },
  { text: "R" },
  { text: "O" },
  { text: "J" },
  { text: "E" },
  { text: "C" },
  { text: "T" },
  { text: " " },
  { text: "T" },
  { text: "A", isInName: true },
  { text: "S", isInName: true },
  { text: "K", isInName: true },
  { text: "S" },
];
