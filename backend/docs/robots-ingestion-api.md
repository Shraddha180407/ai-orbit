# Robots Ingestion API Documentation

This document outlines how the Data Team can programmatically ingest or update Robots and their related entities in the `ai-orbit` database.

## Overview
- **Endpoint**: `POST /api/ingestion/robots`
- **Content-Type**: `application/json`
- **Authentication**: Requires a Bearer token in the `Authorization` header.

```http
Authorization: Bearer <INGESTION_TOKEN>
```

## Behavior
This API acts as an **upsert**. 
- It matches robot records based on their `slug`. 
- **Nested Upserts**: When a robot is ingested, the system will automatically upsert any `Category` and `Task` objects defined in the payload. It will create those entities if they don't exist, and associate the `Robot` with the `Task`.
- If a robot already exists, all its scalar fields will be updated by the ones in the payload, and its associated tasks will be fully replaced by the ones in the payload (by deleting the old associations and creating the new ones).

## Schema Details

The API expects a top-level JSON object containing a `robots` array.

### Robot Object

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | URL-friendly slug for the robot (e.g., "tesla-optimus-gen-2"). |
| `name` | `string` | **Yes** | The name of the robot. |
| `thumbnailUrl` | `string` | No | URL to a thumbnail image. |
| `company` | `string` | **Yes** | The company that created the robot. |
| `country` | `string` | **Yes** | The country of origin. |
| `category` | `enum` | **Yes** | Must be one of: `HUMANOID`, `MOBILE`, `MANIPULATOR`, `DRONE`, `INDUSTRIAL`, `WAREHOUSE`, `HEALTHCARE`, `HOME`, `AGRICULTURAL`, `DEFENSE`, `SERVICE`, `COMPANION`, `OTHER`. |
| `availability` | `enum` | **Yes** | Must be one of: `ANNOUNCED`, `COMMERCIALLY_AVAILABLE`, `DISCONTINUED`, `IN_DEVELOPMENT`, `IN_PRODUCTION`, `PAUSED`, `PILOT`, `PRE_ORDER`, `PROTOTYPE`. |
| `price` | `string` | No | Pricing information as a string. |
| `releaseDate` | `string` | No | Release date string. |
| `mainTask` | `string` | No | The primary task the robot is designed for. |
| `autonomyLevel` | `enum` | No | Must be one of: `TELEOPERATED`, `ASSISTED`, `SEMI_AUTONOMOUS`, `HIGHLY_AUTONOMOUS`, `FULLY_AUTONOMOUS`. |
| `primaryUseCases` | `string[]` | No | Array of strings detailing use cases. Default `[]`. |
| `websiteUrl` | `string` | No | Official website URL. |
| `about` | `string` | No | Long description of the robot. |
| `specs` | `string` | No | Specifications (e.g., Markdown or structured string). |
| `mediaUrls` | `string[]` | No | Array of media URLs. Default `[]`. |
| `tasks` | `object[]` | No | Array of task objects. See Task Object below. Default `[]`. |

### Task Object
Nested inside `Robot.tasks`.

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | The unique slug for the task (e.g., "warehouse-logistics"). |
| `title` | `string` | **Yes** | The title of the task. |
| `description` | `string` | **Yes** | Description of the task. |
| `category` | `object` | **Yes** | See Category Object below. |

### Category Object
Nested inside `Task.category`.

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | The unique slug for the category (e.g., "logistics-and-supply"). |
| `name` | `string` | **Yes** | The display name of the category. |

---

## Sample Payload

```json
{
  "robots": [
    {
      "slug": "tesla-optimus",
      "name": "Tesla Optimus Gen 2",
      "thumbnailUrl": "https://example.com/optimus.jpg",
      "company": "Tesla",
      "country": "USA",
      "category": "HUMANOID",
      "availability": "IN_DEVELOPMENT",
      "price": "$20,000",
      "releaseDate": "2025-01-01",
      "mainTask": "General purpose labor",
      "autonomyLevel": "HIGHLY_AUTONOMOUS",
      "primaryUseCases": ["Manufacturing", "Logistics"],
      "websiteUrl": "https://tesla.com/optimus",
      "about": "A general purpose, bipedal humanoid robot.",
      "specs": "Weight: 121 lbs. Actuators: 28.",
      "mediaUrls": ["https://youtube.com/watch?v=123"],
      "tasks": [
        {
          "slug": "box-sorting",
          "title": "Box Sorting",
          "description": "Sorting boxes of various sizes and weights.",
          "category": {
            "slug": "logistics",
            "name": "Logistics"
          }
        }
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
