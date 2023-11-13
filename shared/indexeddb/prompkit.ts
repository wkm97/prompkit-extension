import Dexie from "dexie";
import { examplePrompts } from "~shared/constants";
import type { IDBPromptTemplate } from "~shared/models/prompt-template";
import { v4 as uuidv4 } from 'uuid';
import { sendToBackground } from "@plasmohq/messaging";

export class IDBPrompkit extends Dexie {
  promptTemplate!: Dexie.Table<IDBPromptTemplate, string>;

  constructor() {
    super("IDBPrompkit");

    this.version(1).stores({
      promptTemplate: "&id,name,createdAt,*tags"
    })

    this.on('populate', (tx) => {
      const samples: IDBPromptTemplate[] = examplePrompts.map(({ name, template }) => ({
        id: uuidv4(),
        name,
        template,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }))
      this.promptTemplate.bulkAdd(samples)
    })
  }
}

// API for the content script to send message to background
export namespace IDBPrompkitAPI {
  const messageName = 'prompt-template'

  export const getAllPromptTemplate = async (): Promise<IDBPromptTemplate[]> => {
    const response = await sendToBackground({ name: messageName, body: { action: "getAll" } })
    return response.results
  }

  export const upsertPromptTemplate = async (payload: Partial<IDBPromptTemplate>) => {
    sendToBackground({ name: messageName, body: { action: 'upsert', payload } })
  }

  export const deletePromptTemplate = async (id: string) => {
    sendToBackground({ name: messageName, body: { action: 'delete', payload: { id } } })
  }

  export const searchPromptTemplate = async (query: string) => {
    if (query) {
      const response = await sendToBackground({ name: messageName, body: { action: "search", payload: { query } } })
      return response.results
    }
    else {
      const response = await sendToBackground({ name: messageName, body: { action: "getAll" } })
      return response.results
    }
  }
}