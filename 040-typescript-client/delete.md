---
sidebar_position: 6
sidebar_label: Deleting Data
keywords: delete, delete data, delete record, delete records, deleting record
---

## Deleting Records

To delete a record you can execute, for example:

````ts|json
  ```ts
  const user = await xata.db.Users.delete('rec_cd8s3r8avc42pi67m13g')

  // or, using the delete method on the record object:
  user.delete()
  ```
  ```json
  // DELETE https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/tables/Users/data/rec_cd8s3r8avc42pi67m13g
  ```
````

In case the record with the given ID doesn't exist, the REST API returns a 404 and the TypeScript SDK throws an exception.

Transactions are used when deleting multiple records:

````ts|json
  ```ts
  const user = await xata.db.Users.delete(['rec_cd8s3r8avc42pi67m13g','rec_cgh9o1oncchhigq95n2g'])
  ```
  ```json
  // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/transaction
  {
  "operations": [
    {
      "delete": {
        "table": "Users",
        "id": "rec_cd8s3r8avc42pi67m13g"
      }
    },
    {
      "delete": {
        "table": "Users",
        "id": "rec_cgh9o1oncchhigq95n2g"
      }
    }
  ]
  }

  ```
````

[Transactions](/typescript-client/transaction) will not fail a delete operation if no record is found. All operations in a transaction must succeed otherwise it is rolled back.

## Next Steps

Now that you have seen how to do the basic create, remove, update, and delete operations, you can check out the docs on using the [free text search API](/typescript-client/search), which is a new super power that Xata gives you.

You can also review the pages on [getting data](/typescript-client/get), [updating data](/typescript-client/update), [inserting data](/typescript-client/insert). We've got guides for each of these operations.
