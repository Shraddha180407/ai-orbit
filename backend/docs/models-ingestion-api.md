# Models Ingestion API Documentation

This document outlines how the Data Team can programmatically ingest or update AI models in the `ai-orbit` database.

## Overview
- **Endpoint**: `POST /api/ingestion/models`
- **Content-Type**: `application/json`
- **Authentication**: Requires a Bearer token in the `Authorization` header.

```http
Authorization: Bearer <INGESTION_TOKEN>
```

## Behavior
This API acts as an **upsert**.
- It matches models based on their `slug`.
- Any connected `provider` (company) provided in the payload will also be automatically upserted based on its `slug`.
- If a model already exists, its primitive fields will be updated, and its `providerId` link will be reconnected to match the payload.

## Schema Details

The API expects a top-level JSON object containing a `models` array.

### Model Object

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | Unique identifier for the model. Used for upserts. |
| `name` | `string` | **Yes** | Display name of the model. |
| `creator` | `string` | **Yes** | Free-text name of the creating organization. |
| `contextWindow` | `string` | **Yes** | Free-text context window size, e.g. `"128K tokens"`. |
| `parameterSize` | `string` | **Yes** | Free-text parameter size, e.g. `"N/A (Proprietary)"`. |
| `modality` | `string` | **Yes** | Comma-separated free-text modalities, e.g. `"Text, Vision"`. |
| `releaseDate` | `string` | **Yes** | Free-text release date, e.g. `"May 2024"`. |
| `description` | `string` | **Yes** | Full description of the model. |
| `websiteUrl` | `string` (URL) | No | Primary URL to the model's page. |
| `capabilities` | `string[]` | No | Array of capability tags. Default is `[]`. |
| `provider` | `object` | No | Details about the model's provider company. See Provider Object. |

### Provider Object
| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | Unique identifier for the company. |
| `name` | `string` | **Yes** | Display name of the company. |
| `logoUrl` | `string` (URL) | No | URL to the company's logo. |

---

## Sample Payload

```json
{
  "models": [
    {
      "slug": "gpt-4o",
      "name": "GPT-4o",
      "creator": "OpenAI",
      "contextWindow": "128K tokens",
      "parameterSize": "N/A (Proprietary)",
      "modality": "Text, Audio, Vision",
      "releaseDate": "May 2024",
      "description": "OpenAI's flagship multimodal model, offering real-time voice capabilities and top performance across vision tasks.",
      "websiteUrl": "https://openai.com/gpt-4o",
      "capabilities": ["Text generation", "Vision", "Audio"],
      "provider": {
        "slug": "openai",
        "name": "OpenAI",
        "logoUrl": "https://openai.com/logo.png"
      }
    }
  ]
}
```

## Responses
- **200 OK**: Successfully processed the payload. Returns a summary object detailing the number of items processed, created, updated, and any errors encountered during the transaction.
- **422 Unprocessable Entity**: The provided payload failed Zod schema validation. The response will include an `issues` array detailing the specific validation failures.
- **401 Unauthorized**: Missing or incorrectly formatted `Authorization` header.
- **403 Forbidden**: Provided token does not match the server's `INGESTION_TOKEN`.