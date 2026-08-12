# Videos Ingestion API Documentation

This document outlines how the Data Team can programmatically ingest or update YouTube videos in the `ai-orbit` database.


## Overview
- **Endpoint**: `POST /api/ingestion/videos`
- **Content-Type**: `application/json`
- **Authentication**: Requires a Bearer token in the `Authorization` header.

```http
Authorization: Bearer <INGESTION_TOKEN>
```

## Behavior
This API acts as an **upsert**. 
- It matches video records based on their `youtubeId`. 
- Since the video record is flattened, there are no nested supporting tables.
- If a video already exists, all its fields will be updated by the ones in the payload.

## Schema Details

The API expects a top-level JSON object containing a `videos` array.

### Video Object

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | **Yes** | An identifier (typically matching `youtubeId` in crawler output). |
| `slug` | `string` | **Yes** | URL-friendly slug for the video (e.g., "my-awesome-video"). |
| `title` | `string` | **Yes** | The title of the video. |
| `description` | `string` | **Yes** | The description text of the video. |
| `toolName` | `string` | **Yes** | Name of the tool this video relates to. |
| `toolCategory` | `string` | **Yes** | Must be one of: `"multimodal-ai"`, `"robotics"`, `"agents"`, `"llm"`, `"general-ai"`. |
| `youtubeId` | `string` | **Yes** | The unique YouTube video ID (e.g., "dQw4w9WgXcQ"). Used for upserts. |
| `thumbnail` | `string` (URL) | **Yes** | The URL to the video thumbnail. |
| `durationSeconds`| `number` | **Yes** | Duration of the video in seconds. |
| `views` | `number` | **Yes** | View count on YouTube. |
| `likes` | `number` | **Yes** | Like count on YouTube. |
| `publishedAt` | `string` | **Yes** | Publication date in string format (e.g., "2024-01-01"). |
| `author` | `object` | **Yes** | Contains `name` (string) and `avatar` (URL string). |
| `channelId` | `string` | No | YouTube channel ID. |
| `tags` | `string[]` | **Yes** | Array of string tags. |
| `accent` | `string` | **Yes** | Accent color hex string. |

---

## Sample Payload

```json
{
  "videos": [
    {
      "id": "abc123xyz",
      "slug": "understanding-llms-in-5-minutes",
      "title": "Understanding LLMs in 5 Minutes",
      "description": "A quick overview of Large Language Models and how they work.",
      "toolName": "ChatGPT",
      "toolCategory": "llm",
      "youtubeId": "abc123xyz",
      "thumbnail": "https://img.youtube.com/vi/abc123xyz/hqdefault.jpg",
      "durationSeconds": 300,
      "views": 15000,
      "likes": 1200,
      "publishedAt": "2024-05-10T14:30:00Z",
      "author": {
        "name": "AI Explained",
        "avatar": "https://yt3.ggpht.com/a/avatar.jpg"
      },
      "channelId": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
      "tags": ["AI", "LLM", "Education"],
      "accent": "#ff0000"
    }
  ]
}
```

## Responses
- **200 OK**: Successfully processed the payload. Returns a summary object detailing the number of items created, updated, and any errors encountered during the transaction.
- **422 Unprocessable Entity**: The provided payload failed Zod schema validation. The response will include an `issues` array detailing the specific validation failures.
- **401 Unauthorized**: Missing or incorrectly formatted `Authorization` header.
- **403 Forbidden**: Provided token does not match the server's `INGESTION_TOKEN`.
