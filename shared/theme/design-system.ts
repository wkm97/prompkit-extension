import type { Theme } from "@emotion/react";
import { tokens } from "./tokens";
import { shadows } from "./tokens/shadow";

const darkTheme = {
  colors: {
    fill: {
      primary: '#1E1E1E',
      secondary: '#252525',
      tertiary: '#2C2C2C'
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.85)',
      secondary: 'rgba(255, 255, 255, 0.55)',
      tertiary: 'rgba(255, 255, 255, 0.25)',
      negative: 'rgba(0, 0, 0, 0.85)'
    },
    accent: {
      primary: 'rgba(10, 132, 255, 1)'
    },
    status: {
      info: '#63B3ED',
      warning: "#FBD38D",
      success: "#9AE6B4",
      error: "#FEB2B2",
      loading: "#90cdf4"
    }
  },
  shadows: {
    border: '0px 0px 0px 0.5px rgba(255, 255, 255, 0.05), 0px 0.5px 2.5px 0px rgba(255, 255, 255, 0.30)',
    container: '0px 38px 90px 0px rgba(0, 0, 0, 0.25), 0px 0px 2px 0px rgba(255, 255, 255, 0.05), 0px 0px 1px 0px rgba(255, 255, 255, 0.60)',
  },
}

export default darkTheme
