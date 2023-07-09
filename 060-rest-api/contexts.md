---
sidebar_position: 3
sidebar_label: API Contexts
---

# API Contexts

Most Xata API operations occur within the context of a **workspace**, which can be thought of as a "organization" in which all of your databases live. Some things though, are not _part_ of a workspace, but adjacent to workspaces&mdash;like _other workspaces_. Because of this, Xata offers different API hosts depending on your usage contexts. We explain this more in the following sections.

## Core API

The Core API is accessible at the origin `https://api.xata.io` and is responsible for operations on all Xata properties that are not bound to a specific workspace. These include:

- `/user`: Since one user can belong to multiple workspaces, a `user` is not bound to a workspace.
- `/workspaces`: A workspace is equivalent to an organization or team, and thus cannot be a child of another workspace. Workspaces are top-level entities, so workspaces are managed with the Core API.

Everything else that falls under the context of a workspace is operable with Xata's workspace-bound APIs.

## Workspace API

Each workspace in Xata can contain any number of databases. Each database has any number of tables and branches. When interacting with Xata properties within the bounds of a workspace, we use the workspace-level API. This is accessible at a domain that is visible to you in your workspace's management section.

![Managing a Workspace in Xata](/images/docs/manage-workspace.png)

For example, the general form of the database API is:

```
https://{workspace-display-name}-{workspace-id}.{region}.xata.sh/db/{dbname}
```

An exampe of this is:

```
https://your-workspace-71fpth.us-east-1.xata.sh/db/yourdatabase
```

In the above:

- `{workspace-display-name}` is the display name of the workspace and is used to make identifying the workspace easier. It is ignored by the API.
- `{workspace-id}` is the unique ID of the workspace, currently consisting of 6 alphanumeric characters.
- `{region}` is the region in which the database is hosted. Note that the region can be configured per database, and this value must match the database region configuration.
- `{dbname}` is the name of the database you are interacting with.

You can find out your workspace domain by navigating to the **Configuration** tab in the Xata Web UI, or in the **Get Code Snippet** fly out under **Set up Xata Project**.
