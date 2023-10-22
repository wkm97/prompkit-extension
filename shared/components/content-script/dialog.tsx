import styled from "@emotion/styled";
import React, { useEffect } from "react";
import { tokens } from "~shared/theme/tokens";
import { useKeyPress } from "~shared/hooks/useKeyPress";

export const ModalOverlay = styled.div({
  position: 'fixed',
  inset: 0,
  backgroundColor: '#00000040',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  zIndex: tokens.zIndex.modal,
})

export const ModalContent = styled.div(({ theme }) => ({
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const ModalBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
})


interface CommandPaletteDialogProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose?: () => void
}

export const ContentScriptDialog = (props: React.PropsWithChildren<CommandPaletteDialogProps>) => {
  const { children, isOpen, onClose, ...rest } = props

  const handleOverlayMousedown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onClose();
  }

  return (
    <>
      {isOpen ?
        <ModalOverlay onMouseDown={handleOverlayMousedown}>
          <ModalContent onMouseDown={e => e.stopPropagation()} {...rest}>
            <ModalBody>
              {children}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
        : null}
    </>
  )
}