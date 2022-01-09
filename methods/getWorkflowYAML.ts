import yaml from "yaml";
import base64 from "base-64";
import { GITHUB_FILES, SERVER_URL } from "../constants/Common";
export default function getWorkFlowYAMLInBae64(
  id: string,
  projectName: string,
  username: string
) {
  let doc = new yaml.Document();
  doc.contents = updateActionWithUserInfo(id, projectName, username);
  let yamlString = yaml.stringify(doc);
  return base64.encode(yamlString);
}

export function getworkFlowUrl(projectName: string, username: string) {
  return (
    GITHUB_FILES +
    username +
    "/" +
    projectName +
    "/contents/.github/workflows/pask-workflow.yml"
  );
}

function updateActionWithUserInfo(
  id: string,
  project: string,
  username: string
) {
  return {
    name: "PASK Task Management",
    on: {
      push: {
        branches: ["**"],
      },
    },
    jobs: {
      build: {
        "runs-on": "ubuntu-latest",
        steps: [
          {
            name: "HTTP Request Action",
            uses: "fjogeleit/http-request-action@v1.8.1",
            with: {
              url: `${SERVER_URL}update?id=${id}&project=${project}&username=${username}`,
              method: "POST",
            },
          },
        ],
      },
    },
  };
}
