import * as React from "react";
import { StyleSheet } from "react-native";
import Navbar from "../components/NavBar";
import { ScrollView, Text, View } from "../components/Themed";
import { red, tintIndigo } from "../constants/Colors";
import { GitHubProject, RootStackScreenProps, Todos } from "../types";
import ActivityIndicator from "../components/ActivityIndicator";
import GitHubCard from "../components/GitHubCard";
import { useAppDispatch } from "../hooks/useRedux";
import {
  handleGitHubProjects,
  useTodoStore,
  handleSelectedProject,
  handleSetTodos,
  useProjectFetchStatus,
} from "../redux/todoSlice";
import useGitHubApi from "../hooks/useGitHubApi";
import { LIST_REPOS } from "../constants/Common";
import ConfModalWithStore from "../components/ConfModalWithStore";
import useAuth from "../hooks/useAuth";
import { useCloseModal, useOpenModal } from "../redux/modalSlice";
import { useAuthStore } from "../redux/authSlice";
import getWorkFlowYAMLInBae64, {
  getworkFlowUrl,
} from "../methods/getWorkflowYAML";
import useFireStore from "../hooks/useFireStore";

export default function CreateTodoScreen({
  navigation,
}: RootStackScreenProps<"CreateTodo">) {
  const dispatch = useAppDispatch();
  const { githubProjects, selectProject, todos, projectFetchStatus } =
    useTodoStore();
  const { uuid, username } = useAuthStore();
  const { get, put, remove } = useGitHubApi();
  const setFetchStatus = useProjectFetchStatus();
  const { signOutAsync } = useAuth();
  const openModal = useOpenModal();
  const closeModal = useCloseModal();
  const { setDocument } = useFireStore();
  const getProjects = async () => {
    get(LIST_REPOS)
      .then((res) => {
        if (res.status === 401) {
          openModal({
            message:
              "The access token is invalid or has expired. Please sign in again.",
            activeModalName: "SIGNINAGAIN",
            btnText: "Sign Out",
            btnColor: tintIndigo,
          });
          setFetchStatus("error");
          return;
        }
        return res.json();
      })
      .then((data) => {
        dispatch(handleGitHubProjects(data));
        setFetchStatus("success");
      })
      .catch((err) => setFetchStatus("error"));
  };

  React.useEffect(() => {
    setFetchStatus("loading");
    getProjects();
    return () => {
      dispatch(handleGitHubProjects([]));
      dispatch(handleSelectedProject());
    };
  }, []);

  const projects = React.useMemo(() => {
    if (
      githubProjects &&
      githubProjects.length > 0 &&
      todos &&
      todos.length > 0
    ) {
      return githubProjects.filter(
        (pr) => !todos.find((val) => val.title === pr.name)
      );
    }
    return githubProjects instanceof Array ? githubProjects : [];
  }, [githubProjects]);

  const createWorkFlowInGitHub = async () => {
    const content = getWorkFlowYAMLInBae64(
      uuid,
      selectProject!.name,
      username!
    );

    const data = JSON.stringify({
      message:
        "PASK created workflow file to trigger updates on the tasks in the project.",
      content,
    });
    return put(getworkFlowUrl(selectProject!.name, username!), data);
  };

  const handleDoneBtn = () => {
    const forkedMessage = selectProject?.fork
      ? "\n(This is a forked project)"
      : "";
    openModal({
      message:
        "This will create a workflow file in your project to sync the commits with the tasks in the project. Do you want to continue?" +
        forkedMessage,
      activeModalName: "CREATETODO",
      leftBtnColor: tintIndigo,
      leftBtnText: "Create",
      rightBtnText: "Cancel",
      leftBtnBold: true,
    });
  };

  const handleError = () => {
    openModal({
      message:
        "Opps! We ran into an error while creating the workflow file. Please try again later.",
      activeModalName: "CREATETODO",
      btnText: "Ok",
      messageColor: red,
    });
    dispatch(handleSelectedProject());
  };

  const createTodo = async () => {
    openModal({
      loading: true,
      activeModalName: "CREATETODO",
    });
    if (selectProject) {
      try {
        const res = await createWorkFlowInGitHub();
        const { content } = await res.json();
        const newTodos: Todos[] = [
          {
            id: new Date().getTime(),
            title: selectProject.name,
            description: selectProject.description,
            url: selectProject.url,
            todos: [],
            sha: content.sha,
          },
          ...todos,
        ];
        if (res.status === 201 || res.status === 202) {
          const _res = await setDocument({ todos: newTodos }, "todos").catch(
            (err) => {
              remove(
                getworkFlowUrl(selectProject!.name, username!),
                JSON.stringify({
                  message: "Deleted the work flow file.",
                  sha: content.sha,
                })
              );
            }
          );

          dispatch(handleSetTodos(newTodos));
          closeModal();
          navigation.navigate("Home");
        } else {
          handleError();
        }
      } catch (error) {
        handleError();
      }
    }
  };
  const signOut = () => {
    signOutAsync().finally(() => {
      closeModal();
    });
  };
  const handleSelectProject = (project: GitHubProject) => {
    if (selectProject && selectProject?.name === project.name) {
      dispatch(handleSelectedProject());
      return;
    }
    dispatch(handleSelectedProject(project));
  };
  return (
    <>
      <ConfModalWithStore onBtnPress={signOut} modalName="SIGNINAGAIN" />
      <ConfModalWithStore
        onLeftBtnPress={createTodo}
        onRightBtnPress={closeModal}
        modalName="CREATETODO"
        onBtnPress={closeModal}
      />
      <View style={styles.container}>
        <Navbar
          title="Select a project"
          showCloseButtom
          showBackButtom={false}
          showDoneButton={selectProject?.id !== undefined}
          doneBtnColor={tintIndigo}
          handleDoneBtn={handleDoneBtn}
        />
        <ScrollView style={styles.scrollView}>
          <View style={styles.projectsContainer}>
            {/* <Text text="semiBoldbodyText" style={{ textAlign: "center" }}>
              Select a project
            </Text> */}
            <View style={styles.projects}>
              {projects.length > 0 &&
                projectFetchStatus !== "loading" &&
                projects.map((commit: GitHubProject) => (
                  <GitHubCard
                    key={commit.id}
                    name={commit.name}
                    description={commit.description}
                    url={commit.url}
                    id={commit.id}
                    repoPrivate={commit.private}
                    fork={commit.fork}
                    owner={commit.owner}
                    selected={selectProject?.id === commit.id}
                    onPress={() => handleSelectProject(commit)}
                  />
                ))}
              {projectFetchStatus === "loading" && <ActivityIndicator />}
              {projectFetchStatus !== "loading" && projects.length <= 0 && (
                <View style={{ justifyContent: "center", paddingTop: 40 }}>
                  <Text
                    text="semiBoldbodyText"
                    style={{ textAlign: "center" }}
                    color={tintIndigo}
                  >
                    No Projects
                  </Text>
                  <Text
                    text="secondaryText"
                    color={tintIndigo}
                    style={{ textAlign: "center" }}
                  >
                    We can't find any projects. Please create a project in
                    GitHub
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  projectsContainer: {
    marginTop: 16,
  },
  projects: {
    paddingTop: 10,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
});
