

import { useEffect, useRef, useState } from "react";
import styled from '@emotion/styled';

export const TextAreaContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1em'
})

export const TextAreaLabel = styled.label({
  fontSize: '1em',
  fontWeight: 'bold',
  marginBottom: '0.5em',
})

export const TextAreaInput = styled.textarea(({ theme }) => ({
  color: theme.colors.text.primary,
  backgroundColor: theme.colors.fill.tertiary,
  fontSize: '1em',
  padding: '0.5em',
  borderRadius: '4px',
  resize: 'vertical',
  minHeight: '100px',
  maxHeight: '50vh',
  transition: 'border-color 0.3s ease',
  border: 'none',
  boxShadow: theme.shadows.border,
  ':focus': {
    outline: 'none',
    borderColor: '#1890ff',
    boxShadow: '0 0 0 2px #1890ff',
  },

  ':hover': {
    borderColor: '#bfbfbf',
  },
}))

export const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.current.style.height = "0px";
      const scrollHeight = textAreaRef.current.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.current.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, props.value]);

  return <TextAreaInput
    ref={textAreaRef}
    {...props}
  />
}
