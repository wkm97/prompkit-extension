import styled from "@emotion/styled"
import { motion } from "framer-motion"
import React, { useEffect, useState } from "react"
import { tokens } from "~shared/theme/tokens"
import { initialEditing, useManager } from "./context"
import type { IDBPromptTemplate } from "~shared/models/prompt-template"
import { GhostButton } from "../button/styled"
import { TrashIcon, PencilSquareIcon, ClipboardIcon } from "@heroicons/react/24/outline"
import { Spacer } from "../spacer"
import { useToast } from "../toast/toast-provider"
import { v4 as uuidv4 } from 'uuid';
import { IDBPuronputoAPI } from "~shared/indexeddb/puronputo"

export const UnorderedList = styled.ul({
  margin: 0,
  listStyleType: 'none',
  padding: 0,
  width: '60vw',
  maxHeight: '80vh'
})

const ListItem = styled.li(({ theme }) => ({
  height: '1em',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: tokens.spacing["2"],
  padding: `${tokens.spacing[4]} ${tokens.spacing[4]}`,
  color: theme.colors.text.primary,
  backgroundColor: 'transparent',
  "&[aria-selected=true]": {
    backgroundColor: theme.colors.accent.primary
  },
  ':last-child': {
    borderBottomLeftRadius: tokens.borderRadius.md,
    borderBottomRightRadius: tokens.borderRadius.md
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

const Notification = styled.div(({theme})=> ({
  backgroundColor: theme.colors.status.success,
  color: 'black',
  padding: tokens.spacing["1"],
  paddingRight: tokens.spacing["8"]
}))

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
  const { state, dispatch } = useManager()
  const {query} = state
  const [prompts, setPrompts] = useState<IDBPromptTemplate[]>([]);
  const [activeIndex, setActiveIndex] = useState(0)
  const toast = useToast();

  const results = prompts

  const refetchPrompts = async () => {
    const results = await IDBPuronputoAPI.searchPromptTemplate(query)
    console.log(results)
    setPrompts(results)
  }

  const handleDelete = (id: string) => {
    IDBPuronputoAPI.deletePromptTemplate(id)
    setPrompts((prev) => {
      return prev.filter(item => item.id !== id)
    })
  }

  const handleCopy = (template: string) => {
    navigator.clipboard.writeText(template)
    toast.addToast({
      id: uuidv4(),
      title: 'Prompt Copied'
    })
  }

  useEffect(() => {
    refetchPrompts()
  }, [query])

  useEffect(() => {
    const handler = (event) => {
      if (event.isComposing) {
        return;
      }
      if (event.key === "ArrowUp" || (event.ctrlKey && event.key === "p")) {
        event.preventDefault();
        setActiveIndex((index) => {
          const nextIndex = index > 0 ? index - 1 : index;
          return nextIndex;
        });
      }
      if (event.key === "ArrowDown" || (event.ctrlKey && event.key === "n")) {
        event.preventDefault();
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
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [results])

  return <motion.div
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -10, opacity: 0 }}
    transition={{ duration: 0.5 }}>
    <UnorderedList>
      {results.map((promptTemplate: IDBPromptTemplate, idx) => {
        const active = idx === activeIndex
        return (
          <ListItem
            key={promptTemplate.id}
            ref={active ? activeRef : null}
            aria-selected={active}
            onMouseOver={() => setActiveIndex(idx)}
            onClick={()=> handleCopy(promptTemplate.template)}
          >
            <PromptTemplateItem
              promptTemplate={promptTemplate}
              onCopy={()=> {
                navigator.clipboard.writeText(promptTemplate.template)
                toast.addToast({
                  id: uuidv4(),
                  title: 'Prompt Copied'
                })
              }}
              onEdit={() => initialEditing(dispatch, promptTemplate)}
              onDelete={() => handleDelete(promptTemplate.id)}
            />
          </ListItem>
        )
      })}
    </UnorderedList>
  </motion.div>
}