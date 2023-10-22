import React, { useEffect } from "react";
import { useReducer } from "react"
import type { TPromptTemplate } from "~shared/models/prompt-template";

export enum ManagerActionKind {
  VIEWING = "viewing",
  CREATING = "creating",
  EDITING = "editing",
  CLOSE = "close"
}

type ManagerAction = {
  type: ManagerActionKind
  payload?: { editor: Partial<TPromptTemplate> }
}

export interface ManagerState {
  operation: ManagerActionKind
  editor?: Partial<TPromptTemplate>
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
            editor: undefined
          }
        default:
          return state;
      }
    }, { operation: ManagerActionKind.CLOSE })

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

  return <ManagerContext.Provider value={{ state, dispatch }}>
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

export const initialEditing = (
  dispatch: React.Dispatch<ManagerAction>, payload: ManagerAction["payload"]
) => dispatch({ type: ManagerActionKind.EDITING, payload })

export const initialCreating = (
  dispatch: React.Dispatch<ManagerAction>, payload?: ManagerAction["payload"]
) => dispatch({
  type: ManagerActionKind.CREATING,
  payload
})