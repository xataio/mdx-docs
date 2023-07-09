---
sidebar_position: 12
sidebar_label: Ask AI
---

# Ask AI endpoint

The `ask` endpoint helps you create interactive and engaging conversational interfaces, Q&A assistants, and chatbots. It gives users the information they need quickly and directly, letting them engage with your product without having to wade through documentation on articles. It uses up-to-date information from your database inside of Xata. This could be your documentation, team knowledge base, or any source of data you've set up. The ask endpoint uses search or similarity search algorithms to find relevant information from your database, and then applies the OpenAI ChatGPT API to generate natural language responses to user queries.

At a high level, the `ask` endpoint works like this:

* Run a text search against the database to find the records that are most relevant to the question asked by the user.
* Produce a prompt with this general form:

```text
With these rules: {rules}
And this text: {context}
Given the above text, answer the question: {question}
Answer:
```

* Send the prompt to the ChatGPT API and let the model complete the answer.

The ask endpoint can use either keyword search or vector/similarity search to find records that are most relevant to the user's query. To learn more about keyword or vector searches, see our [blog the compares the two approaches](https://xata.io/blog/keyword-vs-semantic-search-chatgpt).

## Usage

The `ask` endpoint has the following general form:

````ts|json
 ```ts
const result = await xata.db.Tutorial.ask("<question>",
    {
        rules: [
            // ...array of strings with the rules for the model...,
        ],
        searchType: "keyword|vector",
        search: {
            fuzziness: 0|1|2,
            prefix: "phrase|disabled",
            target: {
                // ...search target options...
            },
            filter: {
                // ...search filter options...
            },
            boosters: [
                // ...search boosters options...
            ]
        },
        vectorSearch: {
            column: "<embedding column>",
            contentColumn: "<content column>",
            filter: {
                // ...search filter options...
            },
        },
    });
 ```
 ```json
    // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/tables/Tutorial/ask
    {
        "question": "<question>",
        "rules": [
            // ...array of strings with the rules for the model...,
        ],
        "searchType": "keyword|vector",
        "search": {
            "fuzziness": 0|1|2,
            "prefix": "phrase|disabled",
            "target": {
                // ...search target options...
            },
            "filter": {
                // ...search filter options...
            },
            "boosters": [
                // ...search boosters options...
            ]
        },
        "vectorSearch": {
            "column": "<embedding column>",
            "contentColumn": "<content column>",
            "filter": {
                // ...search filter options...
            },
        },
    }
    ```
 ```
````

The `ask` endpoint works at the table level. In the above snippet, the name of the table is called `Tutorial`, as a placeholder. Replace `Tutorial` with the name of your table name.

The only mandatory parameter is the `question`, which is the question that the ask endpoint will attempt to answer.
The other options are:
* `rules`: an array of strings with the rules for the model. The rules are passed as part of the prompt and control the
  behavior of the model. For example, you can use the rules to tell the model to answer the question in a specific way,
  for example, more or less concise. See the examples on this page for some ideas.
* `searchType`: the type of search to use to find the relevant records. Can be either `"keyword"`, for using the keyword free-text-search, or `"vector"`, for using semantic/similarity search. The default is `"keyword"`.
* `search`: options for the keyword search. See the [Keyword search options](#keyword-search-options) section for the available options.
* `vectorSearch`: options for the vector search. See the [Vector search options](#vector-search-options) section for the available options.

Note that after performing the search step, the `ask` endpoint will use the top 3 results. In case of keyword search, all string or text columns that have more than 150 characters in the top 3 results will be added to the prompt. In case of vector search, the specified `contentColumn` from the top 3 results will be added to the prompt.

Because the context size is limited, if the generated context is too large, the ask endpoint will attempt to dynamically select the portions of the text that are more relevant.

The response contains the generated answer and the record IDs that were used as context:

```json
  {
    "answer": "<< answer >>",
    "records":[
        "b70d541d114ff54ad15915636450663f"
        "8ae4837002e21f013aa85c30a126ea1c"
        "4b137344a3c53d5152c45ed514188cd2"
    ]
  }
```

You can lookup the records by IDs in the database to get their contents.

### Keyword search options

The options that you can pass under the `search` key mirror a subset of the options from the [search endpoint](/typescript-client/search#searching-in-a-single-table). See that section of the guide for more details.

* `target` to select the columns to search in and to configure column weights.
* `prefix` to configure the prefix matching behavior.
* `fuzziness` to configure the fuzzy matching behavior.
* `filter` to filter the records that are returned by the search.
* `boosters` to tune the relevancy controls.

### Vector search options 

The options that you can pass under the `search` key mirror a subset of the options from the [vector search endpoint](/typescript-client/vector-search). See that section of the guide for more details.

* `column` to select the column that contains the vector embeddings.
* `contentColumn` to select the column that contains the text content that will be used as context.
* `filter` to filter the records that are returned by the search.

## Streaming the response

Because the `ask` endpoint can take several seconds to complete, it supports streaming the response using [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events). 

To enable this mode, pass the `Accept: text/event-stream` header in the request. The response will be a stream of JSON objects, prefixed by the keywords `data`. The last object in the stream contains the `"done": true`:

```text
data: {"text":""}

data: {"text":"To"}

data: {"text":" perform"}

data: {"text":" an"}

...

data: {"done":true,"records":["0415d654cc8dd113e9b9423f425697ae","91301cdc08524e6f6eef5d0b9d66e345","ae0c68966fc0f00cb913b3c209a7c5a1"]}
```

You can find a full Next.js application using the ask endpoint with server-sent events in our [examples repository](https://github.com/xataio/examples/tree/main/apps/sample-chatgpt).

## Examples

To run these examples you need to have a table that contains enough text to make the context useful for a question. String/text columns that are less than 150 characters are ignored by the model.

To index your custom data in Xata, you can use, for example, this [web crawler](https://github.com/tsg/xata-crawler).

The following is the simplest example of using the `ask` endpoint:

````ts|json
 ```ts
 const result = await xata.db.Tutorial.ask("What is this tutorial about?");
 ```
 ```json
    // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/tables/Tutorial/ask
    {
        "question": "What is this tutorial about?"
    }
 ```
````

Because the search step is not specified, keyword search is being used with the default configuration.

The following example tunes the rules and the search step, while still using keyword search:

````ts|json
 ```ts
 const result = await xata.db.Tutorial.ask("How do a retrieve a single record?", {
   rules: [
      "Do not answer questions about pricing or the free tier. Respond that Xata has several options available, please check https://xata.io/pricing for more information.",
      "When you give an example, this example must exist exactly in the context given.",
      "Only answer questions that are relating to the defined context or are general technical questions. If asked about a question outside of the context, you can respond with \"It doesn't look like I have enough information to answer that. Check the documentation or contact support.\"",
      "Your name is DanGPT"
    ],
    searchType: "keyword",
    search: {
      fuzziness: 2,
      prefix: "phrase",
      target: [
        "slug",
        { column: "title", weight: 4 },
        "content",
        "section",
        { column: "keywords", weight: 4 }
      ],
      boosters: [
        {
          valueBooster: {
            column: "section",
            value: "guide",
            factor: 18
          }
        }
      ]
    }
 })
 ```
 ```json
  // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/tables/Tutorial/ask
 {
    "question": "How do a retrieve a single record?",
    "rules": [
      "Do not answer questions about pricing or the free tier. Respond that Xata has several options available, please check https://xata.io/pricing for more information.",
      "When you give an example, this example must exist exactly in the context given.",
      "Only answer questions that are relating to the defined context or are general technical questions. If asked about a question outside of the context, you can respond with \"It doesn't look like I have enough information to answer that. Check the documentation or contact support.\"",
      "Your name is DanGPT"
    ],
    "searchType": "keyword",
    "search": {
      "fuzziness": 2,
      "prefix": "phrase",
      "target": [
        "slug",
        { "column": "title", "weight": 4 },
        "content",
        "section",
        { "column": "keywords", "weight": 4 }
      ],
      "boosters": [
        {
          "valueBooster": {
            "column": "section",
            "value": "guide",
            "factor": 18
          }
        }
      ]
    }
  }
 ```
````

The following example uses vector search:

````ts|json
 ```ts
 const result = await xata.db.Tutorial.ask("How do a retrieve a single record?", {
	rules: [
		"Do not answer questions about pricing or the free tier. Respond that Xata has several options available, please check https://xata.io/pricing for more information.",
		"If the user asks a how-to question, provide a code snippet in the language they asked for with TypeScript as the default.",
		"Only answer questions that are relating to the defined context or are general technical questions. If asked about a question outside of the context, you can respond with \"It doesn't look like I have enough information to answer that. Check the documentation or contact support.\"",
		"Results should be relevant to the context provided and match what is expected for a cloud database.",
		"If the question doesn't appear to be answerable from the context provided, but seems to be a question about TypeScript, Javascript, or REST APIs, you may answer from outside of the provided context.",
		"Your name is DanGPT"
	],
	searchType: "vector",
	vectorSearch: {
		column: "embeddings",
		contentColumn: "content",
		filter: {
			section: "guide"
		}
	}
 })

 ```
 ```json
 // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/tables/Tutorial/ask

 {
	"question": "What is Xata?",
	"rules": [
		"Do not answer questions about pricing or the free tier. Respond that Xata has several options available, please check https://xata.io/pricing for more information.",
		"If the user asks a how-to question, provide a code snippet in the language they asked for with TypeScript as the default.",
		"Only answer questions that are relating to the defined context or are general technical questions. If asked about a question outside of the context, you can respond with \"It doesn't look like I have enough information to answer that. Check the documentation or contact support.\"",
		"Results should be relevant to the context provided and match what is expected for a cloud database.",
		"If the question doesn't appear to be answerable from the context provided, but seems to be a question about TypeScript, Javascript, or REST APIs, you may answer from outside of the provided context.",
		"Your name is DanGPT"
	],
	"searchType": "vector",
	"vectorSearch": {
		"column": "embeddings",
		"contentColumn": "content",
		"filter": {
			"section": "guide"
		}
	}
 }
 ```
````

## Troubleshooting

### No records found

If you see the following error:

```
no records found, it seems that I don't have enough data to answer this question.
```

It means that the search step did not return any results or that the returned results don't have enough text to generate a prompt. Note that string and text columns that have less than 150 characters are ignored.

To solve the issue, you typically need to add more text to the content column, making it sure it has more than 150 characters for most records.