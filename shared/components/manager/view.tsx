import styled from "@emotion/styled"
import { motion } from "framer-motion"
import React, { useEffect, useState } from "react"
import { tokens } from "~shared/theme/tokens"
import { closeManager, initialEditing, useManager } from "./context"
import type { IDBPromptTemplate } from "~shared/models/prompt-template"
import { GhostButton } from "../button/styled"
import { TrashIcon, PencilSquareIcon, ClipboardIcon } from "@heroicons/react/24/outline"
import { Spacer } from "../spacer"
import { useToast } from "../toast/toast-provider"
import { v4 as uuidv4 } from 'uuid';
import { IDBPrompkitAPI } from "~shared/indexeddb/prompkit"
import { FixedSizeList } from 'react-window';
import AutoResizer from "react-virtualized-auto-sizer"
import { useSearchPromptTemplate } from "~shared/hooks/useSearchPromptTemplate"

const List = FixedSizeList<IDBPromptTemplate[]>

export const UnorderedList = styled.ul({
  margin: 0,
  listStyleType: 'none',
  padding: 0,
  width: '60vw',
  paddingBottom: '0.5em'
})

const ListItem = styled.li(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: tokens.spacing["2"],
  height: '100%',
  paddingInlineStart: tokens.spacing[4],
  paddingInlineEnd: tokens.spacing[4],
  color: theme.colors.text.primary,
  backgroundColor: 'transparent',
  "&[aria-selected=true]": {
    backgroundColor: theme.colors.brand.primary,
    color: theme.colors.brand.tertiary
  }
}))

const GhostIconButton = styled(GhostButton)(({ theme }) => ({
  padding: tokens.spacing["1"],
  borderRadius: tokens.borderRadius.full,
  color: theme.colors.text.secondary
}))

const PromptTemplateName = styled.span({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: 1.2
});

interface PromptTemplateItemProps {
  promptTemplate: IDBPromptTemplate
  onCopy: () => void
  onEdit: () => void
  onDelete: () => void
}

const PromptTemplateItem = ({ promptTemplate, onCopy, onEdit, onDelete }: React.PropsWithChildren<PromptTemplateItemProps>) => {
  const preventPropagation: (handler: () => void) => React.MouseEventHandler<HTMLButtonElement> = (handler) => (e) => {
    e.stopPropagation()
    handler();
  }

  return (<>
    <PromptTemplateName>{promptTemplate.name}</PromptTemplateName>
    <Spacer />
    <GhostIconButton onClick={preventPropagation(onCopy)}><ClipboardIcon width="1em" height="1em" strokeWidth={2} /></GhostIconButton>
    <GhostIconButton onClick={preventPropagation(onEdit)}><PencilSquareIcon width="1em" height="1em" strokeWidth={2} /></GhostIconButton>
    <GhostIconButton onClick={preventPropagation(onDelete)}><TrashIcon width="1em" height="1em" strokeWidth={2} /></GhostIconButton>
  </>)
}

export const ManagerView = () => {
  const activeRef = React.useRef<HTMLLIElement>(null);
  const listRef = React.useRef(null);
  const { state, dispatch } = useManager()
  const { query } = state
  const [activeIndex, setActiveIndex] = useState(0);
  const toast = useToast();
  const { results, mutate } = useSearchPromptTemplate({ query, onQueryChange: () => setActiveIndex(0) })

  const handleDelete = (id: string) => {
    mutate(() => IDBPrompkitAPI.deletePromptTemplate(id))
  }

  const handleCopy = (promptTemplate: IDBPromptTemplate) => {
    navigator.clipboard.writeText(promptTemplate.template)
    toast.addToast({
      id: uuidv4(),
      title: `Prompt Copied.`
    })
  }

  const handleInsert = (promptTemplate: IDBPromptTemplate) => {
    const event = new CustomEvent("insert-prompt", {
      detail: {
        template: promptTemplate.template
      }
    })
    document.dispatchEvent(event)
    closeManager(dispatch)

  }

  useEffect(() => {
    if (listRef) {
      listRef.current?.scrollToItem(activeIndex, 'smart')
    }
  }, [activeIndex])

  useEffect(() => {
    const handler = (event) => {
      if (event.isComposing) {
        return;
      }
      if (event.key === "ArrowUp" || (event.ctrlKey && event.key === "p")) {
        event.preventDefault();
        document.body.requestPointerLock();
        setActiveIndex((index) => {
          const nextIndex = index > 0 ? index - 1 : index;
          return nextIndex;
        });
      }
      if (event.key === "ArrowDown" || (event.ctrlKey && event.key === "n")) {
        event.preventDefault();
        document.body.requestPointerLock();
        setActiveIndex((index) => {
          const nextIndex = index < results.length - 1 ? index + 1 : index;
          return nextIndex;
        });
      }
      if (event.key === "Enter") {
        event.preventDefault();
        activeRef.current?.click();
      }
    }

    const exitPointerLockHandler = () => {
      if (document.pointerLockElement === document.body) {
        document.exitPointerLock();
      }
    }

    window.addEventListener("keydown", handler);
    document.body.addEventListener("mousemove", exitPointerLockHandler);
    return () => {
      exitPointerLockHandler();
      window.removeEventListener("keydown", handler)
      document.body.removeEventListener("mousemove", exitPointerLockHandler);
    };
  }, [results])

  const HEIGHT_PER_ITEM = 52

  const height = Math.min(HEIGHT_PER_ITEM * 10, results.length * HEIGHT_PER_ITEM)

  return <motion.div
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -10, opacity: 0 }}
    transition={{ duration: 0.5 }}>
    <UnorderedList style={{ height: height }}>
      <AutoResizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={results.length}
            itemData={results}
            itemSize={HEIGHT_PER_ITEM}
            ref={listRef}
            width={width}
          >
            {({ data, index, style }) => {
              const promptTemplate = data[index]
              const active = index === activeIndex
              return (<div style={style}>
                <ListItem
                  key={promptTemplate.id}
                  ref={active ? activeRef : null}
                  aria-selected={active}
                  onMouseOver={() => setActiveIndex(index)}
                  onClick={() => handleInsert(promptTemplate)}
                >
                  <PromptTemplateItem
                    promptTemplate={promptTemplate}
                    onCopy={() => handleCopy(promptTemplate)}
                    onEdit={() => initialEditing(dispatch, promptTemplate)}
                    onDelete={() => handleDelete(promptTemplate.id)}
                  />
                </ListItem>
              </div>)
            }}
          </List>
        )}
      </AutoResizer>
    </UnorderedList>
  </motion.div>
}