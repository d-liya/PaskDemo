export const getFromGitHub = async (url: string, accessToken: string) => {
  return fetch(url, {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
};

export const updateToGithub = async (
  url: string,
  accessToken: string,
  body?: BodyInit
) => {
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/vnd.github.v3+json",
      Authorization: `token ${accessToken}`,
    },
    body,
  });
};

export const deleteInGithub = async (
  url: string,
  accessToken: string,
  body?: BodyInit
) => {
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/vnd.github.v3+json",
      Authorization: `token ${accessToken}`,
    },
    body,
  });
};
