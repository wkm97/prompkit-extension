import React, { useEffect, useState } from "react";
import { type CommandPaletteProviderProps, type CommandPaletteQuery, type CommandPaletteState, type ICommandPaletteContext } from "./types";
import { IDBPrompkitAPI } from "~shared/indexeddb/prompkit";

const CommandPaletteContext = React.createContext<ICommandPaletteContext>(
  {} as ICommandPaletteContext
);

export const CommandPaletteProvider = ({ children }: React.PropsWithChildren<CommandPaletteProviderProps>) => {
  const [state, setState] = useState<CommandPaletteState>({
    activeIndex: 0,
    searchQuery: '',
    actions: [],
    showing: false
  });
  
  const refetchPrompts = async() => {
    const results = await IDBPrompkitAPI.getAllPromptTemplate()
    const actions = results.map((promptTemplate) => {
      return {
        id: promptTemplate.id,
        name: promptTemplate.name,
        perform: () => {
          const event = new CustomEvent("insert-prompt", {
            detail: {
              template: promptTemplate.template
            }
          })
          document.dispatchEvent(event)
        }
      }
    })
    setState((state)=>({
      ...state,
      actions
    }))
  }

  useEffect(()=>{
    if(state.showing) refetchPrompts()
  }, [state.showing])

  const getState = React.useCallback(() => state, [state])

  const context = React.useMemo(() => {
    const query: CommandPaletteQuery = {
      setActiveIndex: (cb) => {
        setState((state) => ({
          ...state,
          activeIndex: typeof cb === "number" ? cb : cb(state.activeIndex),
        }))
      },
      setShowing: (showing) => {
        setState((state) => ({
          ...state,
          showing
        }))
      },
      setSearch: (searchQuery) =>
        setState((state) => ({
          ...state,
          searchQuery,
        }))
    }

    return { getState, query }
  }, [getState, state])

  return (
    <CommandPaletteContext.Provider value={context}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export const useCommandPalette = () => {
  const context = React.useContext(CommandPaletteContext)
  if (!context) {
    throw new Error('useContentScriptSession must be used within a CommandPaletteContextProvider')
  }
  return context
}