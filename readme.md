This repository contains the guide oriented documentation at xata.io/docs. It does not include the REST API documentation which is stored alongside the private code within Xata itself.

## Contributing

PRs are welcome in this repository. Any merges will trigger a build that will update the statically generated website. Our docs use [MDX](https://mdxjs.com/) syntax, which adds some extra features to typical Markdown.

### Frontmatter

Each MDX document needs to include the following frontmatter at the top of the page. Most fields should be self-explanatory.

```yaml
---
title: Command line interface
navTitle: CLI
keywords: ["terminal", "term", "commands", "cli"]
description: Xata provides a CLI for working with databases
slug: dave/cli
published: true
---
```

#### Slugs

The `slug` field should be written without the `/docs/` prefix and should not contain a forward slash, both of which will be added programmatically. The slug is independent from the folder structure of the menu and it is advised to never edit a slug location once the document is live. If this is needed, please contact a Xata engineer to set up a permanent redirect.

#### Keywords

The `keywords` field accepts an array of strings, and is the highest rated value for search. This should allow authors to "boost" certain words in search over similarly titled documents.

### Folder structure and menus

The folder structure you create in this repository will transform into a collapsible menu system within the site. Write the names of folders in the following syntax: `500-typescript-client`. The number prefix can be any number between `0` and `999`. When making new pages or folders it is advised to give yourself enough room in between numbers to insert new pages. For example, using values of `25` will give you `24` pages in between each page, and leave plenty of room at the end. The numbers are used to provide the order for the folders and pages within the structure.

### MDX Syntax

The following are extra components that can be used within the markdown files.

#### Alerts

Alerts accept a `status` prop.

```tsx
<Alert status="warning">
  This feature is Beta. It is still under active development. While we are avoiding breaking changes, we do not guarantee backwards compatibility until the functionality is GA.
</Alert>
```

#### Images

Images using typical markdown syntax will transform into ones that will work with the Next JS / Vercel pipeline. Images can exist anywhere within this repo, but should be relative to the document they are referenced in

```
![My image](../images/my-image.png)
```

#### Video

When including video in your MDX, utilize the following component. `platform` accepts `html | youtube | vimeo` for sources. If your video is not 16x9, you can pass additional `width` and `height` properties to properly align responsive aspect ratios.

```tsx
<ArticleVideo platform="html" src="https://xata.io/images/blog/launch/search.mp4" autoplay loop />
```

#### Code syntax

Snippets can have the following syntax on the first line to enable various abilities

```
tsx  title="my/file.tsx" showLineNumbers {3-5,7} /highlightWord/
```

You can create tabbed code blocks by enclosing multiple fenced snippets within `<TabbedCode>`.

```tsx
<TabbedCode tabs={['Some typescript', 'Some JSON']}>
~~~
```ts
import { getXataClient } from "./xata";

const client = getXataClient();
const data = await client
  .db[table]
  .select([...])
  .filter({ ... })
  .sort({ ... })
  .page({ ... })
  .getMany();
```
```json
// POST https://{your-workspace-slug}.{region}.xata.sh/db/{db_branch_name}/tables/{table_name}/query

{
  "columns": [...],
  "filter": {
    ...
  },
  "sort": {
    ...
  },
  "page": {
  }
}
```
~~~
</TabbedCode>
```
