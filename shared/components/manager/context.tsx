import React, { useEffect, useMemo, useReducer } from "react";
import type { IDBPromptTemplate } from "~shared/models/prompt-template";

export enum ManagerActionKind {
  VIEWING = "viewing",
  CREATING = "creating",
  EDITING = "editing",
  CLOSE = "close"
}

type ManagerAction = {
  type: ManagerActionKind
  payload?: { editor?: Partial<IDBPromptTemplate>, query?: string }
}

export interface ManagerState {
  operation: ManagerActionKind
  query?: string
  editor?: Partial<IDBPromptTemplate>
}

interface IManagerContext {
  state: ManagerState
  dispatch: React.Dispatch<ManagerAction>
}

const ManagerContext = React.createContext<IManagerContext>(
  {} as IManagerContext
);

export const ManagerProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(
    (state: ManagerState, action: ManagerAction): ManagerState => {
      const { type, payload } = action;
      switch (type) {
        case ManagerActionKind.VIEWING:
          return {
            ...state,
            operation: ManagerActionKind.VIEWING,
            query: payload?.query || ""
          };
        case ManagerActionKind.CREATING:
          return {
            ...state,
            operation: ManagerActionKind.CREATING,
            editor: payload?.editor
          };
        case ManagerActionKind.EDITING:
          return {
            ...state,
            operation: ManagerActionKind.EDITING,
            editor: payload.editor
          };
        case ManagerActionKind.CLOSE:
          return {
            ...state,
            operation: ManagerActionKind.CLOSE,
            query: "",
            editor: undefined
          };
        default:
          return state;
      }
    }, { operation: ManagerActionKind.CLOSE, query: "" })

  useEffect(() => {
    const handler = (event) => {
      if (event.isComposing) {
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        if (state.operation === ManagerActionKind.VIEWING) {
          closeManager(dispatch)
        }
        if ([ManagerActionKind.CREATING, ManagerActionKind.EDITING].includes(state.operation)) {
          openManager(dispatch)
        }
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.operation])

  const context = useMemo(() => ({
    state, dispatch
  }), [state])

  return <ManagerContext.Provider value={context}>
    {children}
  </ManagerContext.Provider>
}

export const useManager = () => {
  const context = React.useContext(ManagerContext)
  if (context === undefined) {
    throw new Error(`useManager must be used within a ManagerProvider`)
  }
  return context
}

export const closeManager = (dispatch: React.Dispatch<ManagerAction>) => dispatch({ type: ManagerActionKind.CLOSE })
export const openManager = (dispatch: React.Dispatch<ManagerAction>) => dispatch({ type: ManagerActionKind.VIEWING })

export const searchResult = (
  dispatch: React.Dispatch<ManagerAction>, query: string
) => dispatch({ type: ManagerActionKind.VIEWING, payload: { query } })

export const initialEditing = (
  dispatch: React.Dispatch<ManagerAction>, editorData: Partial<IDBPromptTemplate>
) => dispatch({ type: ManagerActionKind.EDITING, payload: {editor: editorData} })

export const initialCreating = (
  dispatch: React.Dispatch<ManagerAction>, editorData?: Partial<IDBPromptTemplate>
) => dispatch({
  type: ManagerActionKind.CREATING,
  payload: {editor: editorData}
})