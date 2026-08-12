# Devices Ingestion API Documentation

This document outlines how the Data Team can programmatically ingest or update AI-capable devices in the `ai-orbit` database.

## Overview
- **Endpoint**: `POST /api/ingestion/devices`
- **Content-Type**: `application/json`
- **Authentication**: Requires a Bearer token in the `Authorization` header.

```http
Authorization: Bearer <INGESTION_TOKEN>
```

## Behavior
This API acts as an **upsert**. 
- It matches devices based on their `slug`. 
- If a device already exists, its primitive fields will be updated, and its associated `tasks` will be completely replaced by the ones in the payload.
- Any `tasks` (and their respective `category`) provided in the payload will be automatically created on the fly if they do not already exist in the database, allowing you to link new tasks and capabilities to the device immediately.

## Schema Details

The API expects a top-level JSON object containing a `devices` array.

### Device Object

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | Unique identifier for the device. Used for upserts. |
| `name` | `string` | **Yes** | Display name of the device. |
| `manufacturer` | `string` | **Yes** | Manufacturer name. |
| `category` | `string` | **Yes** | The category the device belongs to (e.g., "Tablet", "Robot"). |
| `availability` | `string` | **Yes** | Must be one of: `"Available"`, `"Pre-order"`, `"Announced"`, `"Discontinued"`. |
| `price` | `string` | No | Pricing information as a string. |
| `year` | `string` | **Yes** | Year of release. |
| `month` | `string` | No | Month of release. |
| `description` | `string` | **Yes** | Full description of the device. |
| `imageUrl` | `string` (URL) | **Yes** | URL to an image of the device. |
| `images` | `string[]` (URLs) | No | Array of URLs to multiple images of the device. Default is `[]`. |
| `videoUrl` | `string` (URL) | No | URL to a promotional/product video. |
| `manufacturerLogoUrl` | `string` (URL) | **Yes** | URL to the manufacturer's logo. |
| `mainTask` | `string` | **Yes** | Primary task the device is used for. |
| `formFactor` | `string` | No | Physical form factor. |
| `country` | `string` | No | Country of origin. |
| `ram` | `string` | No | Memory/RAM specifications. |
| `aiFeatures` | `string[]` | No | Array of AI-specific features. Default is `[]`. |
| `primaryUseCases` | `string[]` | No | Array of primary use cases. Default is `[]`. |
| `additionalInfo` | `string` | No | Any additional information. |
| `buyUrl` | `string` (URL) | No | Link to purchase the device. |
| `tasks` | `object[]` | No | Array of tasks to link. Created automatically if they don't exist. See Task Object. |

### Task Object

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | Unique identifier for the task. |
| `title` | `string` | **Yes** | Display title for the task. |
| `description` | `string` | **Yes** | Full description of the task. |
| `category` | `object` | **Yes** | See Category Object. |

### Category Object (Nested inside Task)

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | Unique identifier for the task category. |
| `name` | `string` | **Yes** | Display name of the task category. |

---

## Sample Payload

```json
{
  "devices": [
    {
      "slug": "orbit-pad-pro",
      "name": "Orbit Pad Pro",
      "manufacturer": "Orbit Inc",
      "category": "Tablet",
      "availability": "Available",
      "price": "$999",
      "year": "2026",
      "month": "July",
      "description": "A high-performance tablet for AI developers.",
      "imageUrl": "https://example.com/orbit-pad.png",
      "images": [
        "https://example.com/orbit-pad-front.png",
        "https://example.com/orbit-pad-back.png",
        "https://example.com/orbit-pad-side.png"
      ],
      "videoUrl": "https://www.youtube.com/watch?v=orbit-pad-pro-demo",
      "manufacturerLogoUrl": "https://example.com/orbit-logo.png",
      "mainTask": "Generative Design",
      "formFactor": "Slate",
      "country": "USA",
      "ram": "16GB",
      "aiFeatures": ["On-device LLM", "Image generation"],
      "primaryUseCases": ["Prototyping", "Media creation"],
      "additionalInfo": "Includes an active stylus.",
      "buyUrl": "https://orbit-pad-pro.example.com/buy",
      "tasks": [
        {
          "slug": "on-device-image-generation",
          "title": "On-Device Image Generation",
          "description": "Generating images without an internet connection using local LLMs.",
          "category": {
            "slug": "design",
            "name": "Design"
          }
        }
      ]
    }
  ]
}
```

## Responses
- **200 OK**: Successfully processed the payload. Returns a summary object detailing the number of items created, updated, and any errors encountered during the transaction.
- **422 Unprocessable Entity**: The provided payload failed validation. The response will include an `issues` array detailing the specific validation failures.
- **401 Unauthorized**: Missing or incorrectly formatted `Authorization` header.
- **403 Forbidden**: Provided token does not match the server's `INGESTION_TOKEN`.
