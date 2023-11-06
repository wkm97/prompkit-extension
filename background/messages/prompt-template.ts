import type { PlasmoMessaging } from "@plasmohq/messaging";
import { IDBPuronputo } from "~shared/indexeddb/puronputo";
import * as FlexSearch from 'flexsearch-ts';
import type { IDBPromptTemplate } from "~shared/models/prompt-template";

const index = new FlexSearch.Document<IDBPromptTemplate, false>({
  document: {
    id: "id",
    index: ["name", "template"]
  },
  tokenize: 'forward'
});


const db = new IDBPuronputo()

db.promptTemplate.toArray().then(results => {
  results.forEach(item => {
    index.add(item.id, item)
  })
})

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  if (req.body.action === 'upsert') {
    const data = req.body.payload
    db.promptTemplate.put(data)
    index.add(data.id, data)
  }

  if (req.body.action === 'delete') {
    db.promptTemplate.delete(req.body.payload.id)
    index.remove(req.body.payload.id)
  }

  if (req.body.action === 'getAll') {
    db.promptTemplate.orderBy('createdAt').reverse().toArray().then(results => {
      res.send({
        results
      })
    })
  }

  if (req.body.action === 'search') {
    const searchResults = index.search(req.body.payload.query, ["name", "template"])
    const allIds = searchResults.flatMap(item=> item.result) as string[]
    const results = await db.promptTemplate.bulkGet(Array.from(new Set(allIds)))
    res.send({
      results
    })
  }
}

export default handler