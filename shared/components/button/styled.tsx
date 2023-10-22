import styled from "@emotion/styled"

const Button = styled.button({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingInlineStart: '1em',
  paddingInlineEnd: '1em',
  lineHeight: 1.2,
  border: 'none',
  fontSize: '16px',
  minHeight: '2em',
  minWidth: '2em'
})

export const SolidButton = styled(Button)(({ theme }) => ({
  color: theme.colors.text.primary,
  backgroundColor: theme.colors.fill.tertiary,
  ':hover': {
    backgroundColor: theme.colors.fill.secondary,
  }
}))

export const GhostButton = styled(Button)(({ theme }) => ({
  color: theme.colors.text.primary,
  backgroundColor: 'transparent',
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
}))