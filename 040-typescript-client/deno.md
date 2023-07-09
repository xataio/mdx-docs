---
sidebar_position: 13
sidebar_label: Deno
---

# Deno Support

The recommended method is to install the [Xata CLI](/getting-started/cli) globally and import the client from the [code generated](/getting-started/cli#codegen) by the CLI.

The Xata CLI provides the option to generate code with Deno imports. When initializing a project with `xata init`, select the "Deno imports" method at the code generation prompt:

```
? Do you want to use code generation in your project?
❯   Generate TypeScript code with Deno imports
```

Since Deno 1.28 node modules can be imported directly, so you can import the SDK like this:

```ts
import {
  buildClient,
  BaseClientOptions,
  XataRecord,
} from 'npm:@xata.io/client@latest'
```

Alternatively, you can import the SDK with any compatible CDN. We recommend Skypack:

```ts
import {
  buildClient,
  BaseClientOptions,
  XataRecord,
} from 'https://cdn.skypack.dev/@xata.io/client?dts'
```
