import { group, outro, select, text } from "@clack/prompts"
import type { LastRunConfig } from "~/db"

// We'll get into the lastRunConfig in the next section
export async function mainMenu(lastRunConfig: LastRunConfig) {
  // group() chains multiple prompts in a row
  const choices = await group(
    {
      username: () =>
        // text() is a basic user input prompt
        text({
          message: "Enter your name: ",
          // if there is a last run, use the value from it
          initialValue: lastRunConfig.username,
          // validate user input before continuing
          validate(value) {
            if (!/[a-z]/.test(value))
              // if we return from validate() the user cannot continue
              return "Username should only contain lowercase characters"
          },
        }),
      // results is an object that contains previous answers!
      environment: ({ results }) =>
        // select() with some types for inferred return types
        select<EnvironmentOption[], EnvironmentValue>({
          message: `Select your environment, ${results.username}`,
          initialValue: lastRunConfig.environment,
          options: [
            // we get auto-complete here from our types
            { value: "dev", label: "Dev" },
            { value: "qa", label: "Staging" },
            {
              value: "prod",
              label: "Prod",
              // hints are only shown when option is hovered
              hint: "⚠ You better know what you are doing",
            },
          ],
        }),
    },
    {
      // in case the user interrupts the menu with CTRL + C
      onCancel: () => {
        outro("K, thx, bye")
        // abort the program, no error
        process.exit(0)
      },
    }
  )

  // we could do more validation or reshaping with the choices here
  return choices as LastRunConfig
}

// --- Types
// I always use this GenericOption for typing selects
export type GenericOption = {
  label?: string | undefined
  hint?: string | undefined
}

// the actual options of our select
export type EnvironmentValue = "dev" | "qa" | "prod"
// some typescript inferrence magic
export type EnvironmentOption = GenericOption &
  Record<"value", EnvironmentValue>
