import styled from "@emotion/styled";
import { tokens } from "~shared/theme/tokens";
import { useCommandPalette } from "./hooks";
import React, { useEffect } from "react";
import type { Action } from "./hooks/types";

const START_INDEX = 0;

const StyledList = styled.ul({
  margin: 0,
  listStyleType: 'none',
  width: '720px',
  padding: 0
})

const StyledItem = styled.li(({ theme }) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: 1,
  height: '1em',
  padding: `${tokens.spacing[4]} ${tokens.spacing[4]}`,
  color: theme.colors.text.primary,
  backgroundColor: 'transparent',
  "&[aria-selected=true]": {
    backgroundColor: theme.colors.brand.primary,
    color: theme.colors.brand.tertiary
  },
  ':last-child': {
    borderBottomLeftRadius: tokens.borderRadius.md,
    borderBottomRightRadius: tokens.borderRadius.md
  }
}))

export const RenderResults = () => {
  const activeRef = React.useRef<HTMLLIElement>(null);
  const { getState, query } = useCommandPalette();
  const { activeIndex, searchQuery, actions } = getState();
  
  const filterQuery = (action: Action) => {
    const actionName = action.name.toLowerCase()
    return actionName.includes(searchQuery.toLowerCase())
  }

  const results = actions?.filter(filterQuery);

  useEffect(() => {
    const handler = (event) => {
      if (event.isComposing) {
        return;
      }
      if (event.key === "ArrowUp" || (event.ctrlKey && event.key === "p")) {
        event.preventDefault();
        query.setActiveIndex((index) => {
          const nextIndex = index > 0 ? index - 1 : index;
          return nextIndex;
        });
      }
      if (event.key === "ArrowDown" || (event.ctrlKey && event.key === "n")) {
        event.preventDefault();
        query.setActiveIndex((index) => {
          const nextIndex = index < results.length - 1 ? index + 1 : index;
          return nextIndex;
        });
      }
      if (event.key === "Enter") {
        event.preventDefault();
        activeRef.current?.click();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [query])

  useEffect(() => {
    query.setActiveIndex(START_INDEX);
  }, [searchQuery]);

  const execute = (action: Action) => {
    query.setShowing(false)
    action.perform();
  }

  return (
    <StyledList role='listbox' title='prompt-templates'>
      {results?.map((action, idx) => {
        const active = idx === activeIndex
        const handlers = {
          onMouseOver: () => query.setActiveIndex(idx),
          onClick: () => execute(action),
        }

        return (
          <StyledItem
            ref={active ? activeRef : null}
            role='option'
            key={idx}
            aria-selected={active}
            {...handlers}
          >
            {action.name}
          </StyledItem>
        )
      }
      )}
    </StyledList>
  )
}