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

#### Images

To make pretty images, utilize the following component. The `variant`, `caption` and `position` are all optional.

The `variant` prop accepts `random` or any camelCase name from [web gradients](https://webgradients.com/)

```tsx
<ArticleImage
  src="https://xata.io/images/blog/auth_js/diagram.png"
  width="954"
  height="420"
  alt="Diagram mapping how authentication will work in our app"
  caption="Our auth architecture"
  variant="crystalRiver"
  position="center"
/>
```

#### Video

When including video in your MDX, utilize the following component. `platform` accepts `html | youtube | vimeo` for sources. If your video is not 16x9, you can pass additional `width` and `height` properties to properly align responsive aspect ratios.

```tsx
<ArticleVideo platform="html" src="https://xata.io/images/blog/launch/search.mp4" autoplay loop />
```

