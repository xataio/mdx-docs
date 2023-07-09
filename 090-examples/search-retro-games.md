---
sidebar_position: 6
sidebar_label: search-retro-games
---

# Search Retro Games

As a directory of classic games, this app was built with Xata using Next.js 13 to showcase Xata's **data storage** and **search** capabilities. It includes boosters and fuzziness combined with Next.js' new approach to server components and its [app/ directory](https://beta.nextjs.org/docs/app-directory-roadmap).

**The app contains over 7,000 games and can search through them in milliseconds.**

![search-retro-games](/images/docs/examples/retro-games.png)

This app was contributed by [Anjana Sofia Vakil](https://anjana.dev/).

Using the app, you can search for games by name as well as filter by genre, platform, and year. The search results will match the search term even if it's misspelled, and the results are sorted by relevance. Relevance is calculated based on the proximity of the search query to the search results, and are then boosted by the game's ratings.

- [Visit the App](https://search-retro-games.vercel.app/) to explore, or
- [View the Source Code](https://github.com/vakila/search-retro-games) to learn more.
