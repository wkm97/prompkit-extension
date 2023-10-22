import { sendToContentScript } from "@plasmohq/messaging";
import { PuronputoEvent } from "~shared/constants";

chrome.commands.onCommand.addListener((command) => {
  if (command === PuronputoEvent.Command.TRIGGER_PANEL) {
    sendToContentScript({ name: PuronputoEvent.Command.TRIGGER_PANEL });
  }
});

chrome.action.onClicked.addListener((tab) => {
  sendToContentScript({ name: "trigger-manager" })
})

chrome.contextMenus.create({
  title: "Copy Prompt: %s",
  contexts: ["selection"],
  id: "copy-prompt"
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy-prompt") {
    sendToContentScript({ name: "copy-prompt", body: { template: info.selectionText } });
  }
})