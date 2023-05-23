---
title: Data model
navTitle: Data model
keywords: ['schema', 'fields', 'field types']
description: How Xata constructs its data model from field types.
slug: data-model
published: true,
---

# Data Model

Xata has a relational data model, with a strict schema (schemaful) and with support for JSON-like objects. Records are grouped into tables, which are grouped into databases. Xata supports rich column types and relations between tables can be represented via link columns, which are similar to foreign keys.

Internally, we are storing the data both in a transactional database (OLTP) as well as in a search/analytics engine (OLAP). This is done transparently for you and the different stores are exposed via the same API. You can read more about how Xata works behind the scenes on the [How it Works](/concepts/how-it-works) page.

Data is organized in "tables" which are grouped into "databases". Tables have a strict [schema](/concepts/schema), which contains a list of columns. Xata supports many column types and the type information is used, among other things, to generate type-safe clients.

You can represent relations between tables of the same database by using columns with type `link`, and it is possible to "join" tables at query time.

## Records

The following is an example of a record that you can store natively in Xata:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 42,
  "address": {
    "street": "123 Main St",
    "city": "New York"
  },
  "labels": ["admin", "user"]
}
```

The keys in the JSON are the column names. The values are the data. The coresponding [schema file](/concepts/schema) for the above record looks like this:

```json
{
  "tables": [
    {
      "name": "users",
      "columns": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "email",
          "type": "email"
        },
        {
          "name": "age",
          "type": "int"
        },
        {
          "name": "address",
          "type": "object",
          "columns": [
            {
              "name": "street",
              "type": "string"
            },
            {
              "name": "city",
              "type": "string"
            }
          ]
        },
        {
          "name": "labels",
          "type": "multiple"
        }
      ]
    }
  ]
}
```

In the above, it's worth noting:

- Each column has a well-defined type. Xata has a strongly typed schema, as opposed to a schemaless model.
- Some of the Xata data types are higher level than typically in a database. For example, the "email" type performs automatic validation of email addresses.

## Column types

### string

The `string` type represents a simple string. The values of this type are indexed both for quick exact matching and for full-text search. Set `unique` to make sure the strings you insert are unique. Set `notNull` to require a value.

Example definition:

```json
{
  "name": "name",
  "type": "string"
}
```

### text

The `text` type represents a long-form text. The difference to `string` is that the values of the `text` columns are indexed and optimised for free-text search, but not for exact matching. Set `notNull` to require a value.

Example definition:

```json
{
  "name": "address",
  "type": "text"
}
```

### int

The `int` type represents an integer. Internally it's represented as a 64-bit signed integer. This means the minimum value is `-9223372036854775808` and the maximum value is `9223372036854775807`. Set `unique` to make sure the integers you insert are unique. Set `notNull` to require a value.

Example definition:

```json
{
  "name": "age",
  "type": "int"
}
```

### float

The `float` type represents a double precision floating point number. Internally, it's represented as a 64-bit signed number with up to 15 decimal digit precision. Set `unique` to make sure the floats you insert are unique. Set `notNull` to require a value.

Example definition:

```json
{
  "name": "distance",
  "type": "float"
}
```

### datetime

The `datetime` type represents a point in time up to millisecond precision. It has the _date_ part and the _time_ part, and both are mandatory. A [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339)-compliant `string` is used for input and output representation. Set `unique` to make sure the values you insert are unique. Set `notNull` so the column value cannot be empty. Select a default value using `defaultValue`. If you set `now` as the default value, the default value of the column will be the time when the record was inserted.

Example definition:

```json
{
  "name": "createdAt",
  "type": "datetime",
  "notNull": true,
  "defaultValue": "now"
}
```

Example values:

```json
{
  "createdAt": "2020-11-10T10:38:16Z"
}
```

```json
{
  "createdAt": "2020-11-10T12:38:16+02:00"
}
```

### bool

The `bool` type represents a boolean.

Example definition:

```json
{
  "name": "isPublished",
  "type": "bool"
}
```

### email

The `email` type represents an email address. Valid email addresses are not longer than 254 characters and respect this regular expression:

```
^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@
[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?
(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$
```

Set `unique` to make sure the strings you insert are unique. Set `notNull` to require a value.

Example definition:

```json
{
  "name": "emailAddress",
  "type": "email"
}
```

Example value:

```json
{
  "emailAddress": "test@example.com"
}
```

### multiple

The `multiple` type represents an array of strings.

Example definition:

```json
{
  "name": "labels",
  "type": "multiple"
}
```

To insert a value into a `multiple` column, use a JSON array of strings, for example:

```json
{
  "labels": ["admin", "user"]
}
```

### vector

The `vector` type represents a vector of floating point numbers with a fixed dimension. This type can be used to store embeddings computed via machine learning, for example by calling the [OpenAI embeddings API](https://platform.openai.com/docs/guides/embeddings). The dimension of the vector must
be defined in the schema, and must be a number between 2 and 10,000. For example:

```json
{
  "name": "embedding",
  "type": "vector",
  "vector": {
    "dimension": 1536
  }
}
```

In the example above we set the dimension to 1536, which is the output dimension produced by the OpenAI embeddings API, however, you can store embeddings
produced by any other machine learning model. Once you store the embeddings, you can use vector search for a number of use cases, see the [Similarity/Vector search](/typescript-client/vector-search) section for more information.

### object

The `object` type represents a group of columns. Objects can also be nested multiple times by adding a column of type `object` inside the object. Set `unique` to make sure the objects you insert are unique.

Example definition:

```json
{
  "name": "address",
  "type": "object",
  "columns": [
    {
      "name": "street",
      "type": "string"
    },
    {
      "name": "city",
      "type": "string"
    }
  ]
}
```

To insert a value of type `object`, simply use a JSON map:

```json
{
  "address": {
    "street": "123 Main St",
    "city": "New York"
  }
}
```

While the API supports the object type, the Web UI and CLI do not expose it as an option yet. There is still work in progress.

In the Web UI, object fields can be created implicitly by creating columns with dotted names. For example columns "user.id" and "user.name" will result in a column "user" of type "object" with the fields "id" and "name" in it, while "user.details.address" will create a nested object "details" within the object "user".

At the moment Xata does not provide automatic schema expansion from JSON objects. The object's structure must be explicitly defined with matching columns in the schema. In case an incoming record contains a JSON object that does not comply with the defined schema, the record will be rejected. Alternatively, JSON content can be stored in text columns.

### link

The `link` type represents a link to another table. See the [links and relations](#links-and-relations) section for more information.

Example definition:

```json
{
  "name": "author",
  "type": "link",
  "link": {
    "table": "users"
  }
}
```

In the above example, the `link.table` property is mandatory and indicates the target table.

To insert the value for a `link` column, use the target record ID as the value. For example:

```json
{
  "author": "rec_1234567890"
}
```

## Special Columns

Xata maintains a special set of columns that don't have to be defined in the schema. The `id` and the `xata.*` columns names are reserved and you cannot create your own columns with these names. No other column names are reserved.

The `id` and `xata.*` are not explicitely represented in the [schema](/concepts/schema) file, because they are present for all tables and maintained by Xata.

### id

The `id` column contains the record ID. It is of type `string`, limited to 255 chars and it is guaranteed to be unique within the table. If you don't explicitly provide an `id` value, Xata will generate one for you, with the following properties:

- globally unique
- sortable, with the newest record having the highest ID

It is possible to use your own ID values, by using the [insert record with ID API](/typescript-client/insert#creating-a-record-with-a-given-id).

### xata.version

The `xata.version` column contains the current version of the record. It is of type `int` and it is automatically incremented any time the record is updated. A newly inserted record will have a version of 0.

This column is meant to be use for optimistic concurrency control, see the [dedicated section](/typescript-client/update#optimistic-concurrency-control) for more information.

## Links and Relations

You can represent 1:N relations between tables by using columns of the `link` type. The value of the link column points to a record in the target table, specified by the ID. At query time, you can easily include columns from the target table by specifying the `"columns"` field in the request. For an example, see [Selecting Columns from the Linked Tables](/typescript-client/get#selecting-columns-from-the-linked-tables).

It is also possible to use `link` columns that target the same table. For example, you can have a `parent` column that points to the parent record of the current record.

You can represent N:M relations between two tables by using a third table dedicated for the relationship. For example, lets say you have a `mentors` table and a `mentee` table, and you want to represent an N:M relation where a mentor can have multiple mentees and a mentee can have multiple mentors. You can create a `relationships` table with a schema looking like this:

```json
{
  "name": "relationships",
  "columns": [
    {
      "name": "mentor",
      "type": "link",
      "link": {
        "table": "mentors"
      }
    },
    {
      "name": "mentee",
      "type": "link",
      "link": {
        "table": "mentees"
      }
    },
    {
      "name": "status",
      "type": "string"
    }
  ]
}
```

In the above, you have links to the `mentors` and `mentees` tables, but you can also add other columns that are specific for the relationship. In the SQL world, this is called an associative or a [junction table](https://en.wikipedia.org/wiki/Associative_entity).

## Default values

You can set a default value for every data type. Default values are used when the value of a column is empty. Keep in mind that zero length string is not empty. You can set a default value using `defaultValue`.

## Constraints

You can add constraints to protect the integrity of your data. We support the following constaints:

- `unique`: All values of a column must be different within the same table. In case of creating or updating a record with a value that does not satisfy the uniqueness contraint, the record operation will be rejected with an error.
- `notNull`: Column value cannot be NULL. Requests to create or update a record are rejected with an error if they set this column to NULL. When `notNull` is set, you must also set a default value for the column using `defaultValue`. In case no value is set for this column when creating a record, **the defaultValue will be applied**.

Limitations: You can add constraints only to new columns of empty tables.

## Consistency

Branches in Xata are replicated from a Primary Store to multiple Replica Stores. Data operations such as insert/update/delete are first performed in the Primary Store and changes are subsequently propagated to the Replica Stores, making them eventually consistent.

The propagation delay may vary and there is no strict guarantee but it is typically much less than 100 milliseconds for the vast majority of requests.

Xata units grant dedicated concurrency slots to the Primary and the eventually consistent Replica Stores. Read operations performed by the `/query` and `/summarize` endpoints can run against either of the Primary or Replica Stores. While the default method for those operations is `consistency: strong`, so they use the Primary Store to ensure the Xata API returns most accurate data by default, it is strongly advised to use the Replica Store wherever possible.

This allows the available concurrency slots in the Primary Store to serve write operations and queries that purposely retrieve the latest state of content. Thus making it less likely for the operations that use the Primary Store to reach the [concurrency limit](/rest-api/limits) and allowing you to get the best possible performance out of your branch's assigned units by utilizing both Store types.

## Conclusion

This is the Xata data model as it stands today. Knowing what's available to you, we'd encourage exploring more concepts such as the [schema](/concepts/schema).
