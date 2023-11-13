import styled from "@emotion/styled";
import React from "react";
import { tokens } from "~shared/theme/tokens";
import type { PlasmoMessaging } from "@plasmohq/messaging";
import { useMessage } from "@plasmohq/messaging/hook";
import { ContentScriptDialog } from "../content-script/dialog";
import { closeManager, initialCreating, openManager, useManager, type ManagerState, searchResult } from "./context";
import { ManagerEditor } from "./editor";
import { ManagerView } from "./view";
import { XMarkIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { motion } from "framer-motion";
import { GhostButton } from "../button/styled";
import { BaseSearchInput } from "../form/input";
import { capitalize } from "~shared/utils";
import { Heading3 } from "../text/heading";
import { Spacer } from "../spacer";
import { PrompkitEvent } from "~shared/constants";

const ManagerHeader = styled.div<ManagerState>(({ operation }) => ({
  padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
  display: 'flex',
  justifyContent: ["creating", "editing"].includes(operation) ? 'space-between' : 'flex-end',
  alignItems: 'center',
  gap: '0.5em'
}))

const ManagerLayout = styled(motion.div)(({ theme }) => ({
  fontSize: '16px',
  backgroundColor: theme.colors.fill.primary,
  boxShadow: theme.shadows.container,
  borderRadius: tokens.borderRadius.md,
  color: theme.colors.text.primary,
}))

const GhostIconButton = styled(GhostButton)(({ theme }) => ({
  padding: tokens.spacing[1],
  borderRadius: tokens.borderRadius.DEFAULT,
  color: theme.colors.text.secondary
}))

const Search = styled(BaseSearchInput)(({ theme }) => ({
}))

export const Manager = ({ children }: React.PropsWithChildren) => {
  const { state, dispatch } = useManager();
  const { operation } = state

  const handleMessage: PlasmoMessaging.Handler = (
    req
  ) => {
    if (req.name === PrompkitEvent.Command.COPY_PROMPT) {
      navigator.clipboard.writeText(document.getSelection().toString())
        .then(() => {
          navigator.clipboard
            .readText()
            .then(
              (clipText) => initialCreating(dispatch, { template: clipText } ));
        })
    }
    if (req.name === PrompkitEvent.Command.TRIGGER_MANAGER) {
      if (operation !== "close") {
        closeManager(dispatch)
      } else {
        openManager(dispatch)
      }
    }
  }

  const { data } = useMessage(handleMessage)

  return (
    <ContentScriptDialog isOpen={operation !== "close"} onClose={() => closeManager(dispatch)}>
      <ManagerLayout
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ManagerHeader operation={operation}>
          {["creating", "editing"].includes(operation) && <>
            <GhostIconButton onClick={() => openManager(dispatch)} aria-label="back">
              <ArrowLeftIcon width="1em" height="1em" strokeWidth={3} />
            </GhostIconButton>
            <Heading3>{`${capitalize(operation)} Prompt Template`}</Heading3>
            <Spacer />
          </>}
          {["viewing"].includes(operation) && <>
            <Search autoFocus placeholder="Search Prompkit..." onChange={(e)=> searchResult(dispatch, e.target.value)}/>
            <GhostIconButton onClick={() => initialCreating(dispatch)} aria-label="create">
              <PlusIcon width="1em" height="1em" strokeWidth={3} />
            </GhostIconButton></>}
          <GhostIconButton onClick={() => closeManager(dispatch)} aria-label="close">
            <XMarkIcon width="1em" height="1em" strokeWidth={3} />
          </GhostIconButton>
        </ManagerHeader>
        {["creating", "editing"].includes(operation) && <ManagerEditor />}
        {["viewing"].includes(operation) && <ManagerView />}
      </ManagerLayout>
    </ContentScriptDialog>
  )
}