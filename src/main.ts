import { mainMenu } from "~/menu"
import { getLastRunConfig, updateLastRunConfig } from "~/db"
import { outro } from "@clack/prompts"

const lastRunConfig = await getLastRunConfig()
const choices = await mainMenu(lastRunConfig)
await updateLastRunConfig(choices)

outro(`Great choices:

Username - ${choices.username}
Environment - ${choices.environment}`)
