import React, { useEffect, useMemo, useState } from "react";

export interface IPromptInjectorContext {
  targetElement: HTMLElement;
}

const PromptInjectorContext = React.createContext<IPromptInjectorContext>({} as IPromptInjectorContext)

const setCursorToEnd = (element: Element) => {
  const range = document.createRange();
  const sel = window.getSelection();
  if (element.hasChildNodes()) {
    range.setStart(element, 1);
  }
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

const promptInjector = (element: Element) => {
  if (['textarea', 'input'].includes(element?.tagName.toLowerCase())) {
    return (prompt: string) => {
      const inputEvent = new Event("input", { bubbles: true, cancelable: false, composed: true })
      const el = (element as HTMLInputElement);
      el.value += prompt;
      el.dispatchEvent(inputEvent)
      el.focus();
    }
  }

  if (element?.getAttribute("contenteditable") === "true") {
    const el = element as HTMLDivElement;
    return (prompt: string) => {
      if (element.hasChildNodes()) {
        element.childNodes[0].textContent += prompt
      } else {
        element.textContent += prompt
      }
      el.focus();
      setCursorToEnd(el)
    }
  }

  return (prompt: string) => {
    console.error(`No injector found to inject ${prompt}`)
  }
}

export const isEditableElement = (element: Element) => {
  const tagName = element.tagName.toLowerCase();
  if (tagName === 'textarea') return true;
  if (tagName === 'input') return true;
  if (element.getAttribute("contenteditable") === "true") return true
  return false;
}

export const getFirstEditableElement = (): HTMLElement => {
  const textarea = document.querySelector("textarea");
  if (textarea) return textarea;

  const input = document.querySelector("input");
  if (input) return input;

  const editable = document.querySelector('[contenteditable="true"]');
  if(editable) return editable as HTMLElement

  return undefined
}

export const PromptInjectorProvider = ({children}: React.PropsWithChildren) => {
  const [targetElement, setTargetElement] = useState<HTMLElement>();

  const injector = React.useCallback(promptInjector(targetElement), [targetElement])

  useEffect(() => {
    const observer = new MutationObserver(function (mutationsList, observer) {
      setTargetElement(getFirstEditableElement())
      observer.disconnect()
    });

    observer.observe(document.body, { childList: true, subtree: true });

  }, [])

  useEffect(() => {
    const eventHandler = (e: CustomEvent) => {
      injector(e.detail.template)
      targetElement.focus();
    }
    document.addEventListener("insert-prompt", eventHandler)

    return () => document.removeEventListener("insert-prompt", eventHandler)
  }, [injector])

  useEffect(() => {
    const handler = (e) => {
      if (isEditableElement(e.target)) {
        setTargetElement(e.target);
      }
    }
    document.addEventListener('focusin', handler)
    return () => document.removeEventListener('focusin', handler)

  }, [])

  const context = useMemo(()=>({targetElement}), [targetElement])

  return (
    <PromptInjectorContext.Provider value={context}>
      {children}
    </PromptInjectorContext.Provider>
  );
}