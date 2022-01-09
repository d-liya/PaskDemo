import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { GitHubProject, Status, Todos } from "../types";

interface TodoState {
  githubProjects: GitHubProject[];
  todos: Todos[];
  selectProject?: GitHubProject;
  status: Status;
  isUpdate: boolean;
  deleteId?: number;
  projectFetchStatus: Status;
}

const initialState: TodoState = {
  githubProjects: [],
  todos: [],
  status: "idle",
  isUpdate: false,
  deleteId: undefined,
  projectFetchStatus: "idle",
};

const todo = createSlice({
  name: "todo",
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
    handleSetTodos: (state, action: PayloadAction<Todos[]>) => {
      state.todos = action.payload;
    },
    handleGitHubProjects: (state, action: PayloadAction<GitHubProject[]>) => {
      state.githubProjects = action.payload;
    },
    handleSelectedProject: (
      state,
      action: PayloadAction<GitHubProject | undefined>
    ) => {
      state.selectProject = action.payload;
    },
    handleStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
    handleIsUpdate: (state, action: PayloadAction<boolean>) => {
      state.isUpdate = action.payload;
    },
    handleDeleteID: (state, action: PayloadAction<number>) => {
      state.deleteId = action.payload;
    },
    handleProjectFetchStatus: (state, action: PayloadAction<Status>) => {
      state.projectFetchStatus = action.payload;
    },
  },
});

export const {
  handleValueChange,
  handleSetTodos,
  handleGitHubProjects,
  handleSelectedProject,
  handleStatus,
  handleIsUpdate,
  handleDeleteID,
  handleProjectFetchStatus,
} = todo.actions;

export const useUpdateValue = () => {
  const dispatch = useAppDispatch();
  return (elementName: string, elementValue: string) =>
    dispatch(handleValueChange({ elementName, elementValue }));
};
export const useUpdateTodos = () => {
  const dispatch = useAppDispatch();
  return (t: Todos[]) => dispatch(handleSetTodos(t));
};
export const useTodoStatus = () => {
  const dispatch = useAppDispatch();
  return (t: Status) => dispatch(handleStatus(t));
};

export const useProjectFetchStatus = () => {
  const dispatch = useAppDispatch();
  return (t: Status) => dispatch(handleProjectFetchStatus(t));
};

export const useIsUpdate = () => {
  const dispatch = useAppDispatch();
  return (t: boolean) => dispatch(handleIsUpdate(t));
};

export const useDeleteID = () => {
  const dispatch = useAppDispatch();
  return (t: number) => dispatch(handleDeleteID(t));
};

export const useTodoStore = () => useAppSelector((state) => state.todo);

export default todo.reducer;
