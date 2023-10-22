import '@emotion/react'
import DesignSystem from './design-system';

type DesignSystemTyping = typeof DesignSystem;

declare module '@emotion/react' {
  export interface Theme extends DesignSystemTyping { }
}