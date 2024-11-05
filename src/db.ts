import { JSONFilePreset } from "lowdb/node"

export type LastRunConfig = {
  username: string
  environment: "qa" | "dev" | "prod"
}
type Data = {
  lastRunConfig: LastRunConfig
}

const defaultData: Data = {
  lastRunConfig: {
    username: "",
    environment: "dev",
  },
}
const db = await JSONFilePreset<Data>("db.json", defaultData)

export async function updateLastRunConfig(config: LastRunConfig) {
  db.data.lastRunConfig = config
  await db.write()
}

export async function getLastRunConfig() {
  await db.read()
  return db.data.lastRunConfig
}
