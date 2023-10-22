import styled from "@emotion/styled";
import { tokens } from "~shared/theme/tokens";

export const InputTextContainer = styled.div(({theme}) =>({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1em'
}))

export const InputTextLabel = styled.label({
  fontSize: '1em',
  fontWeight: 'bold',
  marginBottom: '0.5em'
})

export const InputText = styled.input(({theme})=>({
  color: theme.colors.text.primary,
  backgroundColor: theme.colors.fill.tertiary,
  fontSize: '1em',
  boxShadow: theme.shadows.border,
  padding: '0.5em',
  border: 'none',
  borderRadius: '4px',
  outline: 'none',
  ':focus': {
    outline: 'none',
    borderColor: '#1890ff',
    boxShadow: '0 0 0 2px #1890ff',
  },
  ':hover': {
    borderColor: '#bfbfbf',
  }
}))

export const BaseSearchInput = styled.input(({ theme }) => ({
  color: theme.colors.text.primary,
  background: 'transparent',
  border: 'none',
  marginInline: 0,
  width: '100%',
  fontSize: tokens.font.base.fontSize,
  lineHeight: tokens.font["4xl"].lineHeight,
  ":focus": {
    outline: 'none'
  },
}))
