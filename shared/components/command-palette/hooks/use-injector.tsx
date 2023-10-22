import React, { useEffect, useState } from "react";
import { getFirstEditableElement, isEditableElement } from "~shared/utils";

function setCursorToEnd(element: Element) {
  const range = document.createRange();
  const sel = window.getSelection();
  if (element.hasChildNodes()) {
    range.setStart(element, 1);
  }
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

export const promptInjector = (element: Element) => {
  if (['textarea', 'input'].includes(element?.tagName.toLowerCase())) {
    return (prompt: string) => {
      const inputEvent = new Event("input", { bubbles: true, cancelable: false, composed: true })
      const el = (element as HTMLInputElement);
      el.value = prompt;
      el.dispatchEvent(inputEvent)
      el.focus();
    }
  }

  if (element?.getAttribute("contenteditable") === "true") {
    const el = element as HTMLDivElement;
    return (prompt: string) => {
      if (element.hasChildNodes()) {
        element.childNodes[0].textContent = prompt
      } else {
        element.textContent = prompt
      }
      el.focus();
      setCursorToEnd(el)
    }
  }

  return (prompt: string) => {
    console.error(`No injector found to inject ${prompt}`)
  }
}

export const usePromptInjector = () => {

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
    const eventHandler = (e: CustomEvent) => injector(e.detail.template)
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

  return { injector, targetElement }
}