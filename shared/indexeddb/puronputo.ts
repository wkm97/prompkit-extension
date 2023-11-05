import Dexie from "dexie";
import { examplePrompts } from "~shared/constants";
import type { IDBPromptTemplate } from "~shared/models/prompt-template";
import { v4 as uuidv4 } from 'uuid';
import { sendToBackground, type PlasmoMessaging } from "@plasmohq/messaging";

export class IDBPuronputo extends Dexie {
  promptTemplate!: Dexie.Table<IDBPromptTemplate, number>;
  
  constructor() {  
    super("IDBPuronputo");
    
    this.version(1).stores({
      promptTemplate: "&id,name,createdAt"
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

  messagingHandler (req: PlasmoMessaging.Request, res: PlasmoMessaging.Response) {
    if (req.body.action === 'upsert') {
      this.promptTemplate.put(req.body.payload)
    }
  
    if (req.body.action === 'delete') {
      this.promptTemplate.delete(req.body.payload.id)
    }
  
    if (req.body.action === 'getAll') {
      this.promptTemplate.orderBy('createdAt').reverse().toArray().then(results => {
        res.send({
          results
        })
      })
    }
  }
}

// API for the content script to send message to background
export namespace IDBPuronputoAPI {
  const messageName = 'prompt-template'

  export const getAllPromptTemplate = async (): Promise<IDBPromptTemplate[]> => {
    const response = await sendToBackground({name: messageName, body: {action: "getAll"}})
    return response.results
  }

  export const upsertPromptTemplate = async (payload: Partial<IDBPromptTemplate>) => {
    sendToBackground({ name: messageName, body: { action: 'upsert', payload } })
  }

  export const deletePromptTemplate = async (id: string) => {
    sendToBackground({ name: messageName, body: { action: 'delete', payload: { id } } })
  }
}