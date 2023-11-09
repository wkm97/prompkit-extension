import type { PlasmoCSConfig } from "plasmo"
import createCache from "@emotion/cache"
import { CacheProvider, ThemeProvider } from "@emotion/react"
import theme from "~shared/theme"
import { CommandPaletteSearch } from "~shared/components/command-palette/search"
import { RenderResults } from "~shared/components/command-palette/results"
import { CommandPaletteProvider } from "~shared/components/command-palette/hooks"
import { usePromptInjector } from "~shared/components/command-palette/hooks/use-injector"
import { CommandPaletteDialog } from "~shared/components/command-palette/dialog"

export const config: PlasmoCSConfig = {
  matches: ["https://blank.org/",
    "https://chat.openai.com/*",
    "https://bard.google.com/*",
    "https://claude.ai/*"]
}

const styleElement = document.createElement("style")

const styleCache = createCache({
  key: "plasmo-emotion-cache",
  prepend: true,
  container: styleElement
})

export const getStyle = () => styleElement

export const getShadowHostId = () => "prompkit-panel"

const CommandPalette = () => {
  const { targetElement } = usePromptInjector();

  return (
    <CacheProvider value={styleCache}>
      <ThemeProvider theme={theme}>
        <CommandPaletteProvider>
          <CommandPaletteDialog onClose={() => targetElement.focus()}>
            <CommandPaletteSearch autoFocus defaultPlaceholder='Search Prompt...' />
            <RenderResults />
          </CommandPaletteDialog>
        </CommandPaletteProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default CommandPalette