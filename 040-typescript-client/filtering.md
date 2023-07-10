---
title: What is a serverless data platform
navTitle: Serverless Data Platform
keywords: ['severless']
description: TODO
slug: concepts/serverless-data-platform
published: true
---

---
sidebar_position: 4
sidebar_label: Filtering
keywords: filter, filtering, query
---

# Filtering

The same filtering syntax can be used in multiple places, including the [Query API](/typescript-client/get),
the [Search API](/typescript-client/search), and the [Aggregate API](/typescript-client/aggregate). By using the same
syntax, you can easily switch between the APIs that you need.

We recommend that you use the web UI to build your filters, then use the **Get Code Snippet** functionality to get the
code for your programming language.

## Operators

There are two types of operators:

- Operators that work on a single column: `$is`, `$contains`, `$pattern`, `$includes`, `$gt`, etc.
- Control operators that combine multiple conditions: `$any`, `$all`, `$not`, `$none`, etc.

To distinguish operators from column names, operators are prefixed with a `$` symbol, whereas column names cannot begin with a dollar sign.

## Exact matching

Filter by one column having a particular value:

```json
{
    "filter": {
        "<column_name>": "value"
    }
}
```

Example:

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    name: "Keanu Reave",
  }).getMany();

  // or
  const records = await xata.db.Users
    .filter("name", "Keanu Reave").getMany();

  ```
  ```json
  // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "name": "Keanu Reave"
    }
  }
  ```
````

This is equivalent to using the `$is` operator:

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    name: { $is: "Keanu Reave" },
  }).getMany();

  //or
  import { is } from "@xata.io/client";
  const records = await xata.db.Users
    .filter("name", is("Keanu Reave")).getMany();
  ```
  ```json
  // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "name": { "$is": "Keanu Reave" }
    }
  }
  ```
````

## Control operators

To combine multiple values using the OR logic, you can use the `$any` operator by providing an array of values:

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    name: { $any: ["Keanu Reave", "Carrie-Anne Moss"] },
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "name": {
        "$any": ["Keanu Reave", "Carrie-Anne Moss"]
      }
    }
  }
  ```
````

When you include multiple columns within the same filter, they are logically combined using the AND operator:

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    name: "Keanu Reave",
    "address.city": "New York",
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "name": "Keanu Reave",
      "address.city": "New York"
    }
  }
  ```
````

The above matches if both conditions are met. You can be more explicit about it by using the `$all` and `$any`
operators:

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    $any: {
      name: "Keanu Reave",
      "address.city": "New York",
    },
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "$any": {
        "name": "Keanu Reave",
        "address.city": "New York"
      }
    }
  }
  ```
````

The $all and $any operators can also accept an array of objects, enabling the use of repeated column names:

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    $any: [{ name: "Keanu Reave" }, { name: "Carrie-Anne Moss" }],
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "$any": [
        { "name": "Keanu Reave" },
        { "name": "Carrie-Anne Moss" }
      ]
    }
  }
  ```
````

You can check for a value in a column being not-null with `$exists`:

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    $exists: "name"
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "$exists": "name"
    }
  }
  ```
````

This can be combined with `$all` or `$any`:

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    $all: [
      { $exists: "name" },
      { $exists: "address" },
    ],
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "$all": [
        { "$exists": "name" },
        { "$exists": "address" }
      ]
    }
  }
  ```
````

Or you can use the inverse operator `$notExists`:

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    $notExists: "name"
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "$notExists": "name"
    }
  }
  ```
````

## Negations

The `$not` operator can inverse any operation.

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    $not: {
      name: "Keanu Reeves"
    }
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "$not": {
        "name": "Keanu Reeves"
      }
    }
  }
  ```
````

Or more complex:

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
      $not: {
          $any: [{
              name: "Keany Reave"
          }, {
              name: "Laurence Fishburne"
          }]
      }
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "$not": {
        "$any": [
          {
            "name": "Keany Reave"
          },
          {
            "name": "Laurence Fishburne"
          }
        ]
      }
    }
  }
  ```
````

The `$not: { $any: {}}` can be shorted using the `$none` operator:

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    $none: {
      "name": "Keanu Reave",
      "address.city": "New York"
    }
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "$none": {
        "name": "Keanu Reave",
        "address.city": "New York"
      }
    }
  }
  ```
````

In addition, you can use operators like `$isNot` or `$notExists` to simplify expressions:

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    name: { $isNot: "Keanu Reave" },
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "name": {
        "$isNot": "Keanu Reave"
      }
    }
  }
  ```
````

## Partial match

Xata supports several operators for partial matching, but you should consider using the
[Search API](/typescript-client/search) for more powerful full-text-search.

To match a value partially, you can use the `$contains` operator. Note that `$contains` operator can
cause performance issues at scale, because indices cannot be used.

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    name: { $contains: "Keanu" },
  }).getMany();

  // or
  const records = await xata.db.Users
    .filter("name", contains("Keanu")).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "name": {
        "$contains": "Keanu"
      }
    }
  }
  ```
````

Wildcards are supported via the `$pattern` operator:

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    name: {$pattern: "K*an? R*"}
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "name": {
        "$pattern": "K*an? R*"
      }
    }
  }
  ```
````

The `$pattern` operator accepts two wildcard characters:

- `*` matches zero or more characters
- `?` matches exactly one character

If you want to match a string that contains a wildcard character, you can escape them using a backslash (`\`). You can
escape a backslash by using another backslash.

You can also use the `$startsWith` and `$endsWith` operators:

````ts|json
  ```ts
  const records = await xata.db.Users.filter({
    name: {$startsWith: "Keanu"}
  }).getMany();

  // or
  const records = await xata.db.Users.filter({
    name: {$endsWith: "Reave"}
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/query

  {
    "filter": {
      "name": {
        "$startsWith": "Keanu"
      }
    }
  }
  ```
````

## Comparison operators

The comparison operators are:

- `$gt` - greater than
- `$ge` - greater than or equal
- `$lt` - less than
- `$le` - less than or equal

These operators work on strings, numbers, and datetimes. For example:

````ts|json
  ```ts
  const records = await xata.db.Posts.filter({
    views: {$gt: 5}
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Posts/query

  {
    "filter": {
      "views": {
        "$gt": 5
      }
    }
  }
  ```
````

Example with date ranges, using the built-in [Xata timestamp columns](/concepts/data-model#xata-createdat):

````ts|json
  ```ts
  const records = await xata.db.Posts.filter({
    $all: [
      {
        xata.createdAt: { $ge: new Date("2022-10-25T01:00:00Z") },
      },
      {
        xata.createdAt: { $lt: new Date("2022-10-25T02:00:00Z") },
      }
    ],
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Posts/query

  {
    "filter": {
      "$all": [
        {
          "xata.createdAt": {
            "$ge": "2022-10-25T01:00:00.000Z"
          }
        },
        {
          "xata.createdAt": {
            "$lt": "2022-10-25T02:00:00.000Z"
          }
        }
      ]
    }
  }
  ```
````

## Working with arrays / multiple type

This section applies to the `multiple` type, because it's currently the only array type in Xata.

> ⚠️ **Warning**: This feature is not supported in queries made to our search and analytics store. It applies to queries that use 
> the `aggregate`, `search` (both keyword and vector) endpoints.

To test that an array contains a value, use the `$includes` operator:

````ts|json
  ```ts
  const records = await xata.db.Posts.filter({
    labels: { $includes: "matrix" },
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Posts/query

  {
    "filter": {
      "labels": {
        "$includes": "matrix"
      }
    }
  }
  ```
````

The `$includes` operator accepts a custom predicate that will check if any
array values matches the predicate.

````ts|json
  ```ts
  const records = await xata.db.Posts.filter({
    labels: { $includes: { $contains: "mat" } },
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Posts/query

  {
    "filter": {
      "labels": {
        "$includes": {
          "$contains": "mat"
        }
      }
    }
  }
  ```
````

The above matches if any of the labels contain the string "mat". You can also check that all values in the array match
the predicate,
via the `$includesAll` operator:

````ts|json
  ```ts
  const records = await xata.db.Posts.filter({
    labels: { $includesAll: [{ $contains: "mat" }] },
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Posts/query

  {
    "filter": {
      "labels": {
        "$includesAll": {
          "$contains": "mat"
        }
      }
    }
  }
  ```
````

The above matches if all of the labels contain the string "mat".

Finally, an `$includesNone` operator exists which matches if none of the values in the array match the predicate.

````ts|json
  ```ts
  const records = await xata.db.Posts.filter({
    labels: { $includesNone: [{ $contains: "act" }] },
  }).getMany();
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/Posts/query

  {
    "filter": {
      "labels": {
        "$includesNone": {
          "$contains": "act"
        }
      }
    }
  }
  ```
````

The above matches if none of the labels contains the string "act".
