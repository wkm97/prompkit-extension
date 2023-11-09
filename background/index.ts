import { sendToContentScript } from "@plasmohq/messaging";
import { PrompkitEvent } from "~shared/constants";

chrome.commands.onCommand.addListener((command) => {
  if (command === PrompkitEvent.Command.TRIGGER_MANAGER) {
    sendToContentScript({ name: PrompkitEvent.Command.TRIGGER_MANAGER });
  }
});

chrome.action.onClicked.addListener((tab) => {
  sendToContentScript({ name: PrompkitEvent.Command.TRIGGER_MANAGER })
})

chrome.contextMenus.create({
  title: "Copy Prompt: %s",
  contexts: ["selection"],
  id: PrompkitEvent.Command.COPY_PROMPT
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === PrompkitEvent.Command.COPY_PROMPT) {
    sendToContentScript({ name: PrompkitEvent.Command.COPY_PROMPT, body: { template: info.selectionText } });
  }
})