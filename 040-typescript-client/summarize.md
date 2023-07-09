---
sidebar_position: 10
sidebar_label: Summarizing
keywords: summarize, summarize data
---

# Summarize

The summarize endpoint is used to run calculations on your data. This guide runs through the key concepts, parameters, and how you should use the summarize endpoint.

Summarizing or performing calculations on your data can reveal information to you or the users of your product. You could request the total number of sales in January, the profit on a basketball, or to find the store in your city with the best sales numbers.

After reading this document, you'll have a far better understanding of what the summarize endpoint can do, and where it fits in to the Xata ecosystem.

## Columns & Summaries

The endpoint has two concepts that are important to understand. These are _columns_ and _summaries_. If you're already familiar with aggregations and `GROUP BY` in SQL; you can skip this section.

Let's look at a table. Each time you sell something on your e-commerce store, you insert a row into this table.

| product    | sale_price |
| ---------- | ---------- |
| basketball | 10.0       |
| basketball | 15.0       |
| basketball | 25.0       |
| shirt      | 40.0       |
| shirt      | 80.0       |

Using the above example, a **column** is something you wish to run a calculation for. If you set `product` as a **column** you will see only one row returned for each unique value from the `product` column. In this table, it would mean you receive two rows back. One row for `basketball` and one row for `shirt`.

A **summary** has two parts. These consist of a _function_ (the summary) and a _parameter_ (the column name). The function can be called `sum`, or `average`. The parameter is the column name on which you would like to execute the function. A question I can ask is to `{"sum": "sale_price"}` to retrieve the total sale price.

Referring to the table above; if I'd like to understand how my store has been going, I might ask some tough questions that can be solved with the summarize endpoint.

**What's the average price of a basketball?**

Here, the column is `product`. The `summary` - in it's two parts - will be `average` as the function, and `sale_price` as the column. In plain language, you might ask "give me the average sale price for each product". The request would look like:

````ts|json
  ```ts
  const records = await xata.db.titles.summarize({
    filter: {"product": "basketball"},
    columns: ["product"],
    summaries: {
      "average_sales_price": {"average": "sale_price"}
    }
  })
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/sales/summarize
  {
    "filter": {"product": "basketball"},
    "columns": ["product"],
    "summaries": {
      "average_sale_price": {"average": "sale_price"}
    }
  }
  ```
````

Since we specified `product` in `columns`, we get one row for each unique product in our table. In the request above, we have a key `average_sale_price`. This is the name of your summary; you will see this appear in the result.

```json
{
  "summaries": [{ "product": "basketball", "average_sale_price": 16.6 }]
}
```

Let's try one more example to help clarify the concepts.

**How much money have I made on each product?**

Here, as above, the column is `product`. We will also want to run a calculation on `sale_price`, however, we want to add up each sale price rather than average them, so our `summary` equation will be `sum`. Our request looks like:

````ts|json
  ```ts
  const records = await xata.db.titles.summarize({
    columns: ["product"],
    summaries: {
      "total_sales": {"sum": "sale_price"}
    }
  })
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/sales/summarize
  {
    "columns": ["product"],
    "summaries": {
      "total_sales": {"sum": "sale_price"}
    }
  }
  ```
````

And response:

```json
{
  "summaries": [
    { "product": "basketball", "total_sales": 50.0 },
    { "product": "shirt", "total_sales": 120.0 }
  ]
}
```

Here, we've chosen to call the summarized column `total_sales` and added up all of the `sale_price` of each `product`.

## What can summarize do?

Before we get started, keep in mind that we keep reference material that can be found [here](/api-reference/db/db_branch_name/tables/table_name/summarize#summarize-table).

In its most basic form `summarize` can be used as a "distinct" method to get the unique values or value combinations of the summarized columns.

````ts|json
  ```ts
    const records = await xata.db.titles.summarize({
      columns: ["username"],
      summaries: {},
    });
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/sales/summarize
  {
      "columns": ["username"],
      "summaries": {}
  }
  ```
````

In the above example, we get the unique values of the column "username".

The `summarize` API is limited to one page of results. Refer to the **page** section below for more details.

Let's take a look at the different parameters.

**summaries**

In the summaries key, you set which columns you'd like summarized, and how you'd like them summarized. Xata supports **count**, **sum**, **min**, **max**, and **average**.

All summary functions take a column as an argument. The functions **sum**, **min**, **max**, and **average** can operate on `integer` and `float` columns. They will return an integer or float back; this is determined by which function you use, and the column type it's operating on.

The **count** function is slightly different. Asking for a summary like: `{"count_names": {"count": "name"}}` will return the total number of names that are not null. If you'd like to know the total - including values that are null - you can use the wildcard operator like so: `{"count_all_names": :{"count": "*"}}`.

All summaries support links. If you have a link set up, you specify it using the standard dotted notation; `{"average_pet_size": {"average": {"pet.size"}}`

One can specify several summaries in the same request. As long as the names are unique, do not contain special characters, and do not conflict with columns on your table, you are free to set the names as you wish.

````ts|json
  ```ts
  const records = await xata.db.titles.summarize({
    summaries: {
      // count all rows
      "all_sales": {"count": "*"},

      // count all rows where `store_id` is not null
      "all_sales_from_store": {"count": "store_id"},

      // sum the `profit` column
      "total_profit": {"sum": "profit"},

      // average the `shipping.time_days` column
      "average_shipping_time": {"average": "shipping.time_days"},

      // count the total rows where `has_arrived` is not null
      "total_has_arrived": {"count": "has_arrived"},

      // retrieve the smallest value in the `package_volume` column
      "smallest_package": {"min": "package_volume"}

      // retrieve the largest value in the `sale_price` column
      "largest_sale_price": {"max": "sale_price"}
    }
  })
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/sales/summarize
  {
  "summaries": {
    // count all rows
    "all_sales": {"count": "*"},

    // count all rows where `store_id` is not null
    "all_sales_from_store": {"count": "store_id"},

    // sum the `profit` column
    "total_profit": {"sum": "profit"},

    // average the `shipping.time_days` column
    "average_shipping_time": {"average": "shipping.time_days"},

    // count the total rows where `has_arrived` is not null
    "total_has_arrived": {"count": "has_arrived"},

    // retrieve the smallest value in the `package_volume` column
    "smallest_package": {"min": "package_volume"}

    // retrieve the largest value in the `sale_price` column
    "largest_sale_price": {"max": "sale_price"}
    }
  }
  ```
````

**columns**

The `columns` key lets you specify how you'd like to group your data. Columns work exactly the same as with the [query](/api-reference/db/db_branch_name/tables/table_name/query#query-table) endpoint.

You may submit explicit column names, use wildcards, and reference linked columns as needed.

````ts|json
  ```ts
  const records = await xata.db.titles.summarize({
    columns: [
      "settings.*",        // group by all columns in the `settings` object
      "username",          // group by the username field
      "user.hobbies.name", // group by a linked column
    ]
  })
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/sales/summarize
  {
    "columns": [
      "settings.*",        // group by all columns in the `settings` object
      "username",          // group by the username field
      "user.hobbies.name", // group by a linked column
    ]
  }
  ```
````

If you would like to see results with no groups, you may submit `columns` as an empty array.

**filter**

Filter lets you filter data before grouping and summarizing. Check out our guide [here](/typescript-client/filtering).

Keep in mind: `filter` does **not** support filtering on the result of a summary. In order to filter on summaries, one must use `summariesFilter`.

**sort**

Sort lets you decide how you'd like your results sorted. You may sort on `columns` you've explicitly referenced, as well as on `summaries` you've requested. When wanting to sort by a summary, you use the name you've chosen.

````ts|json
  ```ts
  const records = await xata.db.titles.summarize({
    columns: {"store_name"},
    summaries: {
      "total_sales": {"count": "*"}
    },
    sort: [
      // put the highest total_sales at the top
      {"total_sales": "desc"},
      // if total_sales is equal for two rows, order them by the store_name
      {"store_name": "asc"}
    ]
  })
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/sales/summarize
  {
    "columns": {"store_name"},
    "summaries": {
      "total_sales": {"count": "*"}
    },
    "sort": [
      // put the highest total_sales at the top
      {"total_sales": "desc"},
      // if total_sales is equal for two rows, order them by the store_name
      {"store_name": "asc"}
    ]
  }
  ```
````

**page**

Page lets you determine how many results are returned. We currently only support one parameter: `size`. This allows you to set the amount of rows returned back to you.

The default setting for `size` , if not specified in the request, is 20 results. We allow you to set this between 1 and 1000.

If this limitation is too small, we ask that you move your workload to the [aggregate](/typescript-client/aggregate) endpoint which does not have such limitations.

An example of a page request looks like:

````ts|json
  ```ts
  const records = await xata.db.titles.summarize({
    pagination: {
      size: 50
    }
  })
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/sales/summarize
  {
    "page": {
      "size": 50 // return up to 50 results
    }
  }
  ```
````

**summariesFilter**

In order to filter on the results of a summary operation, Xata supports `summariesFilter`. This has the same syntax and options as the `filter` key defined above.

The key feature `summariesFilter` adds is the ability to take a summary and filter by it.

> ⚠️ **Warning**: Using `summariesFilter` is **much** slower than using `filter`. With this in mind, we recommend that you do as much work as possible using `filter` and use `summariesFilter` only when you really need it.

An example looks like:

````ts|json
  ```ts
  const records = await xata.db.titles.summarize({
    columns: ["product_name"],
    summaries: {
      "revenue": {"sum": "price"},
      "items_sold": {"count": "*"}
    },
    summariesFilter: {
      // only return product names where the total revenue is >= 100 AND
      // where sold >= 1000 of them
      "revenue": {"$ge": 100.0},
      "items_sold": {"$ge": 1000}
    }
  })
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/sales/summarize
  {
    "columns": ["product_name"],
    "summaries": {
      "revenue": {"sum": "price"},
      "items_sold": {"count": "*"}
    },
    "summariesFilter": {
      // only return product names where the total revenue is >= 100 AND
      // where sold >= 1000 of them
      "revenue": {"$ge": 100.0},
      "items_sold": {"$ge": 1000}
    }
  }
  ```
````

**consistency**

By specifying the option `consistency: eventual` the summarize request will be serviced by the Replica Store which has a small, typically insignificant, propagation delay compared to the Primary Store as outlined in the [Data Model](/concepts/data-model) guide.

The default value for the consistency option is `strong`, which retrieves data from the Primary Store and guarantees that the response is up to date with the latest state of the record content.

It is recommended to use the Replica Store for summarize requests wherever possible, in order to get the best possible performance out of your branch's assigned units.

````ts|json
  ```ts
  const records = await xata.db.titles.summarize({
    filter: {"product": "basketball"},
    columns: ["product"],
    summaries: {
      "average_sales_price": {"average": "sale_price"}
    },
    consistency: "eventual"
  })
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/sales/summarize
  {
    "filter": {"product": "basketball"},
    "columns": ["product"],
    "summaries": {
      "average_sale_price": {"average": "sale_price"}
    },
    "consistency": "eventual"
  }
  ```
````

## Tips for keeping summarize fast

If you want to improve the performance of your calls to summarize, here's a few things to look for, and a few to avoid.

**Filter as much as possible**

The more data you filter out using `filter`, the faster your query will be. Use it to filter the exact values you wish to summarize.

**Reduce cardinality from the `columns` call**

If you request a summary for a column with many unique values, the request will take longer. If you're finding your request slow, check the columns you've specified. Can you remove any of them? Filter out any values you're not interested in?

Generally, having as few unique values as possible will speed up your request.

**Avoid links**

Links always add time to the request. If you do not need to reference a link in the `columns` field nor in the `summaries` field, you query will be quicker.

**Use `filters` instead of `summariesFilter` if possible**

Our advice is always to use `filters` where you can. This will give you a much quicker response. Use `summariesFilter` only to filter on summary results, or in complex cases where you need to combine a filter between a column and a summary result.

**Use `consistency: "eventual"` if possible**

Eventual consistency utilizes the dedicated concurrency connections of the Read Replica store, leaving more concurrency slots available for operations that can only operate on the Primary store, such as data inserts and updates. Which makes it less likely to reach the [concurrency limit](/rest-api/limits) of either Store type.

**Use the aggregate endpoint**

The [aggregate](/typescript-client/aggregate) endpoint will almost always perform better. It's quicker to handle larger tables, with more cardinality, and does not have a hard limit on the amount of results that one can request in a single request. See the below section "Summarize or Aggregate" to understand why.

## Summarize or Aggregate?

Summarize and [aggregate](/typescript-client/aggregate) both return similar results. They differ in terms of the underlying store the data is served from. When using summarize, one retrieves data from PostgreSQL. This means that you will retrieve consistent results.

However, PostgreSQL storage is not optimized to work on these types of queries. Running these workloads will tend to be slower and consume for of your account's concurrency limits. For larger tables and for cases where eventual consistency is acceptable, we recommend using the aggregate endpoint. The aggregate endpoint services the same kinds of requests, but from our column-store rather than from Postgres. This results in far faster responses to your requests.

Note: there are some minor differences to how the two endpoints function. Please see the [documentation for aggregate](/typescript-client/aggregate) for more information.
