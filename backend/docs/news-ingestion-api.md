# News Ingestion API Documentation

This document outlines how the Data Team can programmatically ingest or update news articles in the `ai-orbit` database.

## Overview
- **Endpoint**: `POST /api/ingestion/news`
- **Content-Type**: `application/json`
- **Authentication**: Requires a Bearer token in the `Authorization` header.

```http
Authorization: Bearer <INGESTION_TOKEN>
```

## Behavior
This API acts as an **upsert**. 
- It matches news articles based on their `slug`. 
- Any connected entities (`publisher`, `topics`) provided in the payload will also be automatically upserted based on their respective identifiers (`domain` for Publisher, `name` for Topic). 
- If a news article already exists, its primitive fields will be updated, and its associated topics will be fully replaced by the ones in the payload.

## Schema Details

The API expects a top-level JSON object containing a `news` array.

### News Object

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | Unique identifier for the news article. Used for upserts. |
| `title` | `string` | **Yes** | The headline/title of the news article. |
| `dek` | `string` | **Yes** | A brief summary or sub-headline of the article. |
| `aiSummary` | `string` | **Yes** | AI generated summary of the content. |
| `articleUrl` | `string` (URL) | **Yes** | The original URL to the full news article. |
| `category` | `string` | **Yes** | The primary category of the news (e.g., "AI", "Robotics"). |
| `filterTags` | `string[]` | No | Additional tags for filtering. Default is `[]`. |
| `publishedAt` | `string` (ISO date) | **Yes** | The publication date of the article. |
| `publisher` | `object` | **Yes** | Details about the article's publisher. See Publisher Object. |
| `topics` | `object[]` | No | Array of topics this article covers. See Topic Object. Default is `[]`. |

### Publisher Object
| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | **Yes** | Display name of the publisher (e.g., "TechCrunch"). |
| `domain` | `string` | **Yes** | Unique domain of the publisher (e.g., "techcrunch.com"). Used for upserts. |
| `website` | `string` (URL) | **Yes** | URL to the publisher's home page. |
| `logoUrl` | `string` (URL) | No | URL to the publisher's logo. |
| `faviconUrl`| `string` (URL) | No | URL to the publisher's favicon. |
| `colorHex` | `string` | No | Hex color code representing the publisher's brand. |
| `followersLabel` | `string` | No | Text description of follower count if applicable. |
| `credibilityScore` | `number` | No | Numerical score (0.0 - 1.0). Default is `0.8`. |

### Topic Object
| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | **Yes** | Display name of the topic. Used for upserts (e.g., "Machine Learning"). |

---

## Sample Payload

```json
{
  "news": [
    {
      "slug": "orbit-releases-new-ai-model",
      "title": "Orbit Inc Releases Revolutionary New AI Model",
      "dek": "The new model boasts 10x faster inference and improved accuracy.",
      "aiSummary": "Orbit Inc has announced the release of their latest AI model, focusing on speed and accuracy. The model is expected to disrupt the generative AI market.",
      "articleUrl": "https://techchronicle.example.com/orbit-releases-new-model",
      "category": "Artificial Intelligence",
      "filterTags": ["LLM", "Generative AI", "Tech"],
      "publishedAt": "2023-11-01T12:00:00Z",
      "publisher": {
        "name": "Tech Chronicle",
        "domain": "techchronicle.example.com",
        "website": "https://techchronicle.example.com",
        "logoUrl": "https://techchronicle.example.com/logo.png",
        "faviconUrl": "https://techchronicle.example.com/favicon.ico",
        "colorHex": "#FF5733",
        "credibilityScore": 0.95
      },
      "topics": [
        { "name": "Generative AI" },
        { "name": "Product Launch" }
      ]
    }
  ]
}
```

## Responses
- **200 OK**: Successfully processed the payload. Returns a summary object detailing the number of items created, updated, and any errors encountered during the transaction.
- **422 Unprocessable Entity**: The provided payload failed Zod schema validation. The response will include an `issues` array detailing the specific validation failures.
- **401 Unauthorized**: Missing or incorrectly formatted `Authorization` header.
- **403 Forbidden**: Provided token does not match the server's `INGESTION_TOKEN`.
