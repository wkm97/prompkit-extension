import type { PlasmoMessaging } from "@plasmohq/messaging";
import { IDBPuronputo } from "~shared/indexeddb/puronputo";

const db = new IDBPuronputo()

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  db.messagingHandler(req, res)
}

export default handler