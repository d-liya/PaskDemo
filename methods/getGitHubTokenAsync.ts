import { AuthSessionResult } from "expo-auth-session";
import { SERVER_URL } from "../constants/Common";
async function createTokenWithCode(code: any, redirect_uri: string) {
  const url = `${SERVER_URL}auth?code=${code}&redirect_uri=${redirect_uri}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return res.json();
}

async function getGithubTokenAsync(
  response: AuthSessionResult,
  redirect_uri: string
): Promise<{
  access_token?: string;
  error?: string;
  type: string;
  message?: string;
}> {
  try {
    if (response.type !== "success") {
      // type === 'cancel' = if you cancel out of the modal
      // type === 'error' = if you click "no" on the redirect page
      return { type: response.type };
    }
    const { params } = response;
    // this is different to `type === 'error'`
    if (params.error) {
      const { error, error_description } = params;
      if (error === "redirect_uri_mismatch") {
        console.warn(
          `Please set the "Authorization callback URL" in your Github application settings to ${redirect_uri}`
        );
        return { error, message: error_description, type: "error" };
      }
      throw new Error(`Github Auth: ${error} ${error_description}`);
    }
    const { access_token } = await createTokenWithCode(
      params.code,
      redirect_uri
    );
    return { access_token, type: "success" };
  } catch ({ message }) {
    console.log("getGithubTokenAsync: C: ", { message });
    return { type: "error" };
  }
}

export default getGithubTokenAsync;
