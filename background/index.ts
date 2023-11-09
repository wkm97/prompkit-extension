import { sendToContentScript } from "@plasmohq/messaging";
import { PuronputoEvent } from "~shared/constants";

chrome.commands.onCommand.addListener((command) => {
  if (command === PuronputoEvent.Command.TRIGGER_MANAGER) {
    sendToContentScript({ name: PuronputoEvent.Command.TRIGGER_MANAGER });
  }
});

chrome.action.onClicked.addListener((tab) => {
  sendToContentScript({ name: PuronputoEvent.Command.TRIGGER_MANAGER })
})

chrome.contextMenus.create({
  title: "Copy Prompt: %s",
  contexts: ["selection"],
  id: PuronputoEvent.Command.COPY_PROMPT
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === PuronputoEvent.Command.COPY_PROMPT) {
    sendToContentScript({ name: PuronputoEvent.Command.COPY_PROMPT, body: { template: info.selectionText } });
  }
})