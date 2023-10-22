import type { TPromptTemplate } from "~shared/models/prompt-template";

type ActionId = string;

export type Action = {
  id: ActionId;
  name: string;
  icon?: string | React.ReactElement | React.ReactNode;
  subtitle?: string;
  perform?: () => void;
};

export interface CommandPaletteState {
  searchQuery: string;
  activeIndex: number;
  actions: Array<Action>;
  showing: boolean;
}

export interface CommandPaletteQuery {
  setActiveIndex: (cb: number | ((currIndex: number) => number)) => void;
  setShowing: (showing: boolean) => void;
  setSearch: (search: string) => void;
}

export interface ICommandPaletteContext {
  getState: () => CommandPaletteState
  query: CommandPaletteQuery
}

export interface CommandPaletteProviderProps {
}