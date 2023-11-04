// Toast.js

import React, { memo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useToast, type ToastOptions } from './toast-provider';
import styled from '@emotion/styled';
import { GhostButton } from '../button/styled';
import { tokens } from '~shared/theme/tokens';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { borderRadius } from '~shared/theme/tokens/border';
import { motion } from 'framer-motion';

const ToastPortal = ({ children }: React.PropsWithChildren) => {
  const toast = useToast()
  const rootContainer = toast.rootRef.current

  return ReactDOM.createPortal(children, rootContainer);
}

interface ToastProps {
  id: string | number,
  title: string
}

const ToastContainer = styled(motion.div)(({ theme }) => ({
  fontSize: '16px',
  fontFamily: tokens.fontFamily.sans.join(','),
  position: 'relative',
  margin: tokens.spacing['2'],
  color: theme.colors.text.primary,
  backgroundColor: theme.colors.status.info,
  boxShadow: theme.shadows.border,
  borderRadius: tokens.borderRadius.lg
}))



const ToastHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: tokens.spacing["2"],
  paddingTop: tokens.spacing["2"],
  paddingBottom: tokens.spacing["2"],
  paddingLeft: tokens.spacing["4"],
  paddingRight: tokens.spacing["10"]
})

const CloseButton = styled(GhostButton)(({ theme }) => ({
  position: 'absolute',
  padding: tokens.spacing["0"],
  top: '0px',
  right: '0px',
  borderRadius: tokens.borderRadius.full,
  color: theme.colors.text.primary,
  ':hover': {
    backgroundColor: 'transparent'
  }
}))


export const Toast = ({ id, title }: ToastProps) => {
  const {removeToast} = useToast()
  const timeout = 5000

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id)
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, timeout]);

  return (<ToastPortal>
    <ToastContainer
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CloseButton onClick={() => removeToast(id)} aria-label="close">
        <XMarkIcon width="1em" height="1em" strokeWidth={3} />
      </CloseButton>
      <ToastHeader>
        <InformationCircleIcon width="1em" height="1em" strokeWidth={3} />
        {title}
      </ToastHeader>
    </ToastContainer>
  </ToastPortal>)
};