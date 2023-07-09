---
sidebar_position: 11
sidebar_label: Transactions
---

# Transactions

# Intro

The transactions endpoint lets you execute multiple operations together as a single unit. In this guide, we'll run through why transactions are important and run through Xata's transactions endpoint.

Our transactions endpoint is still in beta. This means that the core functionality is stable, but the API itself might change. There are also many new capabilities that we - and our existing users - would like to add to the endpoint.

If you're burning to give feedback or get access, you can find more details at the bottom of this page.

# Why transactions are important

(If you're already familiar with transactions, you can skip this section.)

Reliability is important when it comes to your data. You want to know that when you ask for something to be stored, that it'll be stored or that you'll receive an error explaining why not. No half-written records, no returning "OK" but not writing it, no writing it and then removing it again.

As you add new features to your application, you'll see some patterns emerge. You want to create a user and a workspace at the same time. Or you'll want to remove a user from the wait-list when they sign-up. Your users will also hope that when they make a payment to your product, that their credits show up.

Transactions are in the business of making these promises. A transaction lets you - the developer - run multiple requests as one. These requests are all guaranteed to succeed, or all guaranteed to fail. The database guarantees that a user and workspace will be created, that the user is removed from the wait-list, and it absolutely guarantees that your users' credits will show up in their account upon payment.

# Xata's approach

Transactions come with a lot of knobs and dials. Transactions give control over how operations are executed, as well as what is and is not allowed to happen in a database while the transactions is executing.

Xata's role is to help you build and iterate on your product faster, so we've started off with features to help you make use of transactions, but without you needing to dive into the nitty gritty.

Our approach with transactions has been to start small, and to be careful about finding the right balance between usefulness and ease of use for you, the builder.

# API

The Xata transactions API be thought of as a way to wrap our existing insert, update, and delete operations into a single operation. The options for each operation are almost identical to their non-transactional counterparts.

We'll start by taking a look at a full request-response, and then we'll step into each operation and its options.

````ts|json
  ```ts
  const result = await xata.transactions.run([
    { insert: { table: 'titles', record: { originalTitle: 'A new film' } } },
    { insert: { table: 'titles', record: { id: 'new-0', originalTitle: 'The squeel' }, createOnly: true } },
    { update: { table: 'titles', id: 'new-0', fields: { originalTitle: 'The sequel' }, ifVersion: 0 } },
    { update: { table: 'titles', id: 'new-1', fields: { originalTitle: 'The third' }, upsert: true } },
    { get:    { table: "titles", id: "new-0", columns: ['id', 'originalTitle']}},
    { delete: { table: 'titles', id: 'new-0' } }
  ]);
  ```
  ```json
  // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/transaction
  {
      "operations": [
          {"insert": {"table": "titles", "record": {"originalTitle": "A new film"}}},
          {"insert": {"table": "titles", "record": {"id": "new-0", "originalTitle": "The squeel"}, "createOnly": true}},
          {"update": {"table": "titles", "id": "new-0", "fields": {"originalTitle": "The sequel"}, "ifVersion": 0}},
          {"update": {"table": "titles", "id": "new-1", "fields": {"originalTitle": "The third"}, "upsert": true}},
          {"get":    {"table": "titles", "id": "new-0", "columns": ["id", "originalTitle"]}},
          {"delete": {"table": "titles", "id": "new-0"}}
      ]
  }
  ```
````

If successful, you can be certain that all operations have succeeded. You will receive a response like below:

```
{
    "results": [
        {"operation": "insert", "rows": 1, "id": "rec-123456789"},
        {"operation": "insert", "rows": 1, "id": "new-0"},
        {"operation": "update", "rows": 1, "id": "new-0"},
        {"operation": "update", "rows": 1, "id": "new-1"},
        {"operation": "get",    "columns": { "id": "new-0", "originalTitle": "The sequel" }},
        {"operation": "delete", "rows": 1}
    ]
}
```

Or, in case of error, you know that all operations have been rolled back for you. You will receive a response like below:

```json
{
  "errors": [
    { "index": 0, "message": "table [invalid] not found" },
    { "index": 7, "message": "table [titles]: column [x]: column not found" }
  ]
}
```

In order to access the errors array returned from the Typescript SDK you can handle errors with a `try catch` statement:

```ts
import { FetcherError } from '@xata.io/client';

try {
    const result = await xata.transactions.run([{...operations...}]);
} catch (error: FetcherError) {
    console.log(error.status);
    console.log(error.errors);
}
```

**inserts**

Inserts can be used to insert records across any number of tables in your database. As with the insert endpoints,
you can explicitly set an ID, or omit it and have Xata auto-generate one for you. Either way, on a successful transaction,
Xata will return the ID to you.

By default, if a record exists with the same explicit ID, Xata will overwrite the record. You can adjust this behavior by
setting `createOnly` to `true` for the operation.

````ts|json
  ```ts
  const result = await xata.transactions.run([
    { insert: { table: 'titles', record: { id: "rec_cfl4g6v838og05h0iv6g", originalTitle: 'A new film' }, createOnly: true } }
  ]);
  ```
  ```json
  // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/transaction
  {
      "operations": [
          {"insert": {"table": "titles", "record": {"id": "rec_cfl4g6v838og05h0iv6g", "originalTitle": "A new film"}, "createOnly": true } }
      ]
  }
  ```
````

We also support the `ifVersion` flag to avoid overwriting unexpected versions of the record.

If an insert fails for any reason; invalid data, unknown table, ifVersion conflicts, the transaction will return an error.

**updates**

Updates can be used to update records in any number of tables in your database. The update operation requires an ID parameter
explicitly defined. The operation will only replace the fields explicitly specified in your operation. The update operation
also supports the `upsert` flag. Off by default, but if set to `true`, the update operation will insert the record if no
record is found with the provided ID.

As with insert operations, update supports `ifVersion`.

Update operations can be used on operations from the same transaction, and will return an error if the ID is not found in the
database.

**deletes**

A delete is used to remove records. Delete can operate on records from the same transaction, and will not cancel a transaction
if no record is found.

**gets**

A get is used to retrieve a record by id. A get operation can retrieve records created in the same transaction but will not cancel
a transaction if no record is found.

# Limitations

The only limitation to be aware of at this point s that Xata allows a maximum of 1000 operations to run in a single transaction. If you exceed this limit, you will receive an error message.
