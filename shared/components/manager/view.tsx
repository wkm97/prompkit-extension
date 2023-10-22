import styled from "@emotion/styled"
import { sendToBackground } from "@plasmohq/messaging"
import { color, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { tokens } from "~shared/theme/tokens"
import { initialEditing, useManager } from "./context"
import type { TPromptTemplate } from "~shared/models/prompt-template"
import { GhostButton } from "../button/styled"
import { TrashIcon, PencilSquareIcon, ClipboardIcon } from "@heroicons/react/24/outline"
import { Spacer } from "../spacer"
import React from "react"

export const UnorderedList = styled.ul({
  margin: 0,
  listStyleType: 'none',
  padding: 0,
  width: '60vw'
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
})

interface PromptTemplateItemProps {
  promptTemplate: TPromptTemplate
  onEdit: () => void
  onDelete: () => void
}

const PromptTemplateItem = ({ promptTemplate, onEdit, onDelete }: React.PropsWithChildren<PromptTemplateItemProps>) => {
  return (<>
    <PromptTemplateName>{promptTemplate.name}</PromptTemplateName>
    <Spacer />
    <GhostIconButton onClick={()=>navigator.clipboard.writeText(promptTemplate.template)}><ClipboardIcon width="1em" height="1em" strokeWidth={2} /></GhostIconButton>
    <GhostIconButton onClick={onEdit}><PencilSquareIcon width="1em" height="1em" strokeWidth={2} /></GhostIconButton>
    <GhostIconButton onClick={onDelete}><TrashIcon width="1em" height="1em" strokeWidth={2} /></GhostIconButton>
  </>)
}

export const ManagerView = () => {
  const activeRef = React.useRef<HTMLLIElement>(null);
  const { dispatch } = useManager()
  const [prompts, setPrompts] = useState<TPromptTemplate[]>([]);
  const [activeIndex, setActiveIndex] = useState(0)

  const results = prompts

  const refetchPrompts = async () => {
    const response = await sendToBackground({ name: "prompt-template", body: { action: "getAll" } })
    setPrompts(response.results)
  }

  const handleDelete = (id: string) => {
    sendToBackground({ name: 'prompt-template', body: { action: 'delete', payload: { id } } })
    setPrompts((prev) => {
      return prev.filter(item => item.id !== id)
    })
  }

  useEffect(() => {
    refetchPrompts()
  }, [])

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
      {results.map((promptTemplate: TPromptTemplate, idx) => {
        const active = idx === activeIndex
        return (
          <ListItem
            key={promptTemplate.id}
            ref={active ? activeRef : null}
            aria-selected={active}
            onMouseOver={() => setActiveIndex(idx)}
            onClick={()=> navigator.clipboard.writeText(promptTemplate.template)}
          >
            <PromptTemplateItem
              promptTemplate={promptTemplate}
              onEdit={() => initialEditing(dispatch, { editor: promptTemplate })}
              onDelete={() => handleDelete(promptTemplate.id)}
            />
          </ListItem>
        )
      })}
    </UnorderedList>
  </motion.div>
}