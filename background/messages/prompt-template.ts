import type { PlasmoMessaging } from "@plasmohq/messaging";
import Dexie from "dexie";
import { examplePrompts } from "~shared/constants";
import { v4 as uuidv4 } from 'uuid';

const db = new Dexie("data");

db.version(1).stores({
  promptTemplate: "&id,name,createdAt"
})
db.on('populate', (tx) => {
  const samples = examplePrompts.map(({ name, template }) => ({
    id: uuidv4(),
    name,
    template,
    author: 'me as author',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }))
  tx.db.table("promptTemplate").bulkAdd(samples)
})

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  if (req.body.action === 'upsert') {
    db.table("promptTemplate").put(req.body.payload)
  }

  if (req.body.action === 'delete') {
    db.table("promptTemplate").delete(req.body.payload.id)
  }

  if (req.body.action === 'getAll') {
    db.table("promptTemplate").orderBy('createdAt').reverse().toArray().then(results => {
      res.send({
        results
      })
    })
  }
}

export default handler