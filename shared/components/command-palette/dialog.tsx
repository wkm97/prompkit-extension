import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { tokens } from "~shared/theme/tokens";
import { useCommandPalette } from "./hooks";
import type { PlasmoMessaging } from "@plasmohq/messaging";
import { PuronputoEvent } from "~shared/constants";
import { useMessage } from "@plasmohq/messaging/hook";
import { useKeyPress } from "~shared/hooks/useKeyPress";
import { ContentScriptDialog } from "../content-script/dialog";

interface CommandPaletteDialogProps {
  onClose?: () => void
}

const StyledContent = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.fill.primary,
  boxShadow: theme.shadows.container,
  borderRadius: tokens.borderRadius.md,
  color: theme.colors.text.primary,
}))

export const CommandPaletteDialog = ({ children, onClose }: React.PropsWithChildren<CommandPaletteDialogProps>) => {
  const { query, getState } = useCommandPalette();
  const { showing } = getState()
  const escPress: boolean = useKeyPress("Escape");

  useEffect(() => {
    if (escPress) {
      handleOnClose();
    }
  }, [escPress])

  const panelHandler: PlasmoMessaging.Handler = (
    req
  ) => {
    if (req.name === PuronputoEvent.Command.TRIGGER_PANEL) {
      query.setShowing(!showing)
    }
  }
  const { data } = useMessage(panelHandler)

  const handleOnClose = () => {
    query.setShowing(false)
    onClose && onClose()
  }

  return (
    <ContentScriptDialog isOpen={showing} onClose={handleOnClose}>
      <StyledContent>
        {children}
      </StyledContent>
    </ContentScriptDialog>
  )
}