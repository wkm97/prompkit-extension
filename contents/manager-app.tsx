import createCache from "@emotion/cache"
import { CacheProvider, ThemeProvider } from "@emotion/react"
import type { PlasmoCSConfig } from "plasmo"
import { ManagerProvider } from "~shared/components/manager/context"
import theme from "~shared/theme"
import { Manager } from "~shared/components/manager"
import { ToastProvider } from "~shared/components/toast/toast-provider"
import { PromptInjectorProvider } from "~shared/contexts/injector-context"

// export const config: PlasmoCSConfig = {
//   matches: ["https://blank.org/",
//     "https://chat.openai.com/*",
//     "https://bard.google.com/*",
//     "https://claude.ai/*"]
// }

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"],
}

const styleElement = document.createElement("style")

const styleCache = createCache({
  key: "plasmo-emotion-cache",
  prepend: true,
  container: styleElement
})

export const getStyle = () => styleElement

export const getShadowHostId = () => "prompkit-manager"

export const ManagerApp = () => {
  return (
    <CacheProvider value={styleCache}>
      <ThemeProvider theme={theme}>
        <PromptInjectorProvider>
          <ToastProvider>
            <ManagerProvider>
              <Manager />
            </ManagerProvider>
          </ToastProvider>
        </PromptInjectorProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default ManagerApp