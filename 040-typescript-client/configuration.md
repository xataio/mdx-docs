---
sidebar_position: 2
sidebar_label: Config
---

## Configuration Overrides

You **should not** edit your generated file (e.g. `./src/xata.ts`) since any changes to your schema will cause the file to rebuild when `xata codegen` is run. If you need to override the configuration, you can set up a separate file alongside the generated code.

```ts
export const getXataClient = () => {
  if (instance) return instance

  instance = new XataClient({
    // Override configuration here
    databaseURL: process.env.XATA_DATABASE_URL,
    apiKey: process.env.XATA_API_KEY,
    fetch: fetch,
    branch: process.env.XATA_BRANCH,
    // ... other configuration
  })
  return instance
}
```

## Manually passing the apiKey

Some frameworks may not be compatible with parsing credentials from `.env`, instead requiring to pass your API key manually with the `apiKey` constructor option:

```ts
import { XataClient } from './xata'
const xata = new XataClient({ apiKey: XATA_API_KEY })
```

## Providing a fetch implementation

In case your runtime does not provide a built-in Fetch API (such as with versions prior to Node 18), you will need to pass a fetch implementation to the `fetch ` constructor parameter of the XataClient in the `xata.ts` / `xata.js `file in your project.

## Updating the schema

The command `xata codegen` updates the schema for the Xata client. Applying schema changes from the CLI, such as using the command `xata schema edit`, will automatically run codegen to update your client. However, in case schema changes have been applied from the web UI, you should run `xata codegen` to update your existing client with the latest schema.
