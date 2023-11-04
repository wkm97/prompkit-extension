import styled from '@emotion/styled';
import React, { createContext, useContext, useRef, useState, type Ref, type MutableRefObject, useCallback, useMemo } from 'react';
import { tokens } from '~shared/theme/tokens';
import { Toast } from './toast';

export interface ToastOptions {
  id: string | number
  title?: string
  render?: () => React.ReactNode
}

export interface IToastContext {
  addToast: (options: ToastOptions) => void
  removeToast: (id: string | number) => void
  rootRef: React.MutableRefObject<HTMLDivElement>
}

const ToastContext = createContext<IToastContext>({} as IToastContext);

const NotificationsArea = styled.div({
  position: 'fixed',
  zIndex: tokens.zIndex.snackbar,
  display: 'flex',
  flexDirection: 'column-reverse',
  top: '0px',
  right: '0px'
})

export const ToastProvider = ({ children }) => {
  const rootRef = useRef<HTMLDivElement>();
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const context = useMemo(()=> ({
    addToast: (options: ToastOptions) => {
      setToasts((prevToasts) => [...prevToasts, options]);
    },
    removeToast: (id: string | number) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }
  }), [])

  return (
    <ToastContext.Provider value={{ ...context, rootRef }}>
      {children}
      <NotificationsArea ref={rootRef}>
        {toasts.map(({ id, title }) => <Toast key={id} id={id} title={title} />)}
      </NotificationsArea>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
