# Repositories Ingestion API Documentation

This document outlines how the Data Team can programmatically ingest or update GitHub repositories in the `ai-orbit` database.

## Overview
- **Endpoint**: `POST /api/ingestion/repositories`
- **Content-Type**: `application/json`
- **Authentication**: Requires a Bearer token in the `Authorization` header.

```http
Authorization: Bearer <INGESTION_TOKEN>
```

## Behavior
This API acts as an **upsert**. 
- It matches repository records based on their `githubId` (GitHub's numeric repository ID). 
- If a repository already exists, all its scalar fields will be updated by the ones in the payload.
- **Slug Collision Handling**: If the provided `slug` is already occupied by a different repository (different `githubId`), the slug is automatically suffixed with the last 6 digits of the `githubId` to avoid collisions. This matches the behaviour of the existing `sync-repositories.ts` script.

## Schema Details

The API expects a top-level JSON object containing a `repositories` array.

### Repository Object

| Field | Type | Required | Description |
|---|---|---|---|
| `githubId` | `number` | **Yes** | GitHub's numeric repository ID. Used as the primary upsert key. |
| `slug` | `string` | **Yes** | URL-friendly slug (e.g., "openai-whisper"). May be collision-resolved automatically. |
| `name` | `string` | **Yes** | The repository name on GitHub. |
| `owner` | `string` | **Yes** | The GitHub owner/login (e.g., "openai"). |
| `ownerAvatarUrl` | `string` (URL) | No | URL to the owner's avatar image. |
| `description` | `string` | No | Repository description from GitHub. |
| `url` | `string` (URL) | **Yes** | The GitHub HTML URL of the repository. |
| `homepage` | `string` (URL) | No | Homepage URL if set on GitHub. |
| `language` | `string` | No | Primary programming language. |
| `license` | `string` | No | SPDX license identifier (e.g., "MIT", "Apache-2.0"). |
| `topics` | `string[]` | No | Array of GitHub topic tags. Default is `[]`. |
| `stars` | `number` | **Yes** | Number of GitHub stars. |
| `forks` | `number` | **Yes** | Number of forks. |
| `openIssues` | `number` | **Yes** | Number of open issues. |
| `defaultBranch` | `string` | No | Default branch name. Default is `"main"`. |
| `logoUrl` | `string` (URL) | No | Logo/avatar URL (typically the owner avatar). |
| `brandColor` | `string` | No | Brand color hex string. |
| `githubCreatedAt` | `string` (ISO date) | **Yes** | When the repository was created on GitHub. |
| `syncedAt` | `string` (ISO date) | **Yes** | Timestamp of when this data was synced from GitHub. |

---

## Sample Payload

```json
{
  "repositories": [
    {
      "githubId": 123456789,
      "slug": "openai-whisper",
      "name": "whisper",
      "owner": "openai",
      "ownerAvatarUrl": "https://avatars.githubusercontent.com/u/123456",
      "description": "Robust Speech Recognition via Large-Scale Weak Supervision",
      "url": "https://github.com/openai/whisper",
      "homepage": "https://openai.com/whisper",
      "language": "Python",
      "license": "MIT",
      "topics": ["speech-recognition", "openai", "machine-learning"],
      "stars": 70000,
      "forks": 8000,
      "openIssues": 100,
      "defaultBranch": "main",
      "logoUrl": "https://avatars.githubusercontent.com/u/123456",
      "brandColor": null,
      "githubCreatedAt": "2022-09-15T00:00:00Z",
      "syncedAt": "2026-07-29T00:00:00Z"
    }
  ]
}
```

## Responses
- **200 OK**: Successfully processed the payload. Returns a summary object detailing the number of items created, updated, and any errors encountered during the transaction.
- **422 Unprocessable Entity**: The provided payload failed Zod schema validation. The response will include an `issues` array detailing the specific validation failures.
- **401 Unauthorized**: Missing or incorrectly formatted `Authorization` header.
- **403 Forbidden**: Provided token does not match the server's `INGESTION_TOKEN`.

## Notes

### Upsert Key
The `githubId` field is the primary upsert key. This is consistent with the existing `sync-repositories.ts` script. Each repository is uniquely identified by its GitHub numeric ID.

### Slug Collision
When the provided `slug` is already in use by a different repository (different `githubId`), the API appends the last 6 digits of the `githubId` to the slug. For example, if `openai-whisper` is already taken by repository `111111`, a new repository with `githubId` `222222` and slug `openai-whisper` would be stored as `openai-whisper-222222`.

### No Nested Relations
Unlike Tools or Robots, the Repository model has no foreign key relationships. Company enrichment is resolved dynamically at query time by matching the `owner` field against Company names/slugs. This makes the ingestion service straightforward — a single flat upsert per repository.
