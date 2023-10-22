import styled from "@emotion/styled";
import { tokens } from "~shared/theme/tokens";

export const ManagerLayout = styled.div({
  height: '50vh',
  width: '70vw'
})

export const ManagerHeader = styled.div({
})

export const ManagerContent = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.fill.secondary,
  boxShadow: tokens.shadows.xxl,
  borderRadius: `0 0 ${tokens.borderRadius.md} ${tokens.borderRadius.md}`,
  border: `1px solid ${theme.colors.fill.tertiary}`,
  color: theme.colors.text.primary
}))