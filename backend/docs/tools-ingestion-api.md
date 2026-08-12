# Tools Ingestion API Documentation

This document outlines how the Data Team can programmatically ingest or update AI tools in the `ai-orbit` database.

## Overview
- **Endpoint**: `POST /api/ingestion/tools`
- **Content-Type**: `application/json`
- **Authentication**: Requires a Bearer token in the `Authorization` header.

```http
Authorization: Bearer <INGESTION_TOKEN>
```

## Behavior
This API acts as an **upsert**. 
- It matches tools based on their `slug`. 
- Any connected entities (`company`, `categories`, `tags`) provided in the payload will also be automatically upserted based on their respective `slug`s. 
- If a tool already exists, its primitive fields will be updated, and its associated categories and tags will be fully replaced by the ones in the payload.

## Schema Details

The API expects a top-level JSON object containing a `tools` array.

### Tool Object

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | Unique identifier for the tool. Used for upserts. |
| `name` | `string` | **Yes** | Display name of the tool. |
| `description` | `string` | **Yes** | Full description of the tool. |
| `websiteUrl` | `string` (URL) | **Yes** | Primary URL to the tool. |
| `logoUrl` | `string` (URL) | No | URL to the tool's logo. |
| `screenshots` | `string[]` | No | Array of screenshot URLs. Default is `[]`. |
| `features` | `string[]` | No | Array of feature strings. Default is `[]`. |
| `pros` | `string[]` | No | Array of pros strings. Default is `[]`. |
| `cons` | `string[]` | No | Array of cons strings. Default is `[]`. |
| `releaseDate` | `string` (ISO date) | No | The release date of the tool. |
| `pricingModel` | `string` | **Yes** | Must be one of: `"FREE"`, `"FREEMIUM"`, `"PAID"`, `"FREE_TRIAL"` |
| `pricingAmount` | `number` | No | Numerical price. |
| `billingFrequency`| `string` | No | Must be one of: `"MONTHLY"`, `"YEARLY"`, `"ONE_TIME"`, `"NA"`. Default is `"NA"`. |
| `isOpenSource` | `boolean` | No | Indicates if the tool is open source. Default is `false`. |
| `isTrending` | `boolean` | No | Indicates if the tool is currently trending. Default is `false`. |
| `verified` | `boolean` | No | Indicates if the tool is verified. Default is `false`. |
| `compatibility` | `string[]` | No | Supported platforms. Must be from: `"WEB"`, `"WINDOWS"`, `"MACOS"`, `"LINUX"`, `"IOS"`, `"ANDROID"`, `"CHROME_EXTENSION"`. Default is `[]`. |
| `targetUsers` | `string[]` | No | Target personas. Must be from: `"DEVELOPERS"`, `"DESIGNERS"`, `"STUDENTS"`, `"MARKETERS"`, `"WRITERS"`, `"RESEARCHERS"`, `"EDUCATORS"`, `"SALES"`, `"ENTERPRISE"`, `"CONTENT_CREATORS"`. Default is `[]`. |
| `hasApi` | `boolean` | No | Indicates if the tool provides an API. Default is `false`. |
| `apiDocsUrl` | `string` (URL) | No | URL to the API documentation. |
| `performanceScore` | `number` | No | A numerical performance score. |
| `company` | `object` | No | Details about the parent company. See Company Object. |
| `toolCategories`| `string[]` | No | Array of category enums. Must be from: `"WRITING"`, `"IMAGE_GENERATION"`, `"VIDEO_GENERATION"`, `"AUDIO"`, `"CHATBOTS"`, `"CODING"`, `"MARKETING"`, `"PRODUCTIVITY"`, `"BUSINESS"`, `"EDUCATION"`, `"AGENTS"`, `"PRESENTATIONS"`, `"THREE_D_GENERATION"`, `"NO_CODE_AI_BUILDERS"`, `"WORKFLOW_AUTOMATION"`. |
| `categories` | `object[]` | No | Array of legacy category objects. |
| `tags` | `object[]` | No | Array of tags describing the tool. See Entity Object. |
| `integrations` | `object[]` | No | Array of integrations the tool supports. See Integration Object. |
| `tasks` | `object[]` | No | Array of tasks the tool is associated with. See Task Object. |

### Company Object
| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | Unique identifier for the company. |
| `name` | `string` | **Yes** | Display name of the company. |
| `logoUrl` | `string` (URL) | No | URL to the company's logo. |

### Entity Object (Categories / Tags)
| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | Unique identifier for the category/tag. |
| `name` | `string` | **Yes** | Display name of the category/tag. |

### Integration Object
| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | Unique identifier for the integration. |
| `name` | `string` | **Yes** | Display name of the integration. |
| `logoUrl` | `string` (URL) | No | URL to the integration's logo. |

### Task Object
| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | Unique identifier for the task. Used to connect the tool to an existing task in the database. |
| `name` | `string` | No | Display name of the task. |

---

## Sample Payload

```json
{
  "tools": [
    {
      "slug": "orbit-ai-generator",
      "name": "Orbit AI Generator",
      "description": "A powerful AI generator for orbits.",
      "websiteUrl": "https://orbit-ai.example.com",
      "logoUrl": "https://orbit-ai.example.com/logo.png",
      "pricingModel": "FREEMIUM",
      "pricingAmount": 15.00,
      "billingFrequency": "MONTHLY",
      "isOpenSource": false,
      "isTrending": true,
      "verified": true,
      "features": ["Text generation", "Image generation"],
      "pros": ["Fast generation", "High quality"],
      "cons": ["Expensive tier", "Steep learning curve"],
      "releaseDate": "2023-01-01T00:00:00Z",
      "compatibility": ["WEB", "IOS"],
      "targetUsers": ["DESIGNERS", "CONTENT_CREATORS"],
      "hasApi": true,
      "apiDocsUrl": "https://orbit-ai.example.com/docs",
      "performanceScore": 9.5,
      "screenshots": [
        "https://orbit-ai.example.com/screenshot1.png"
      ],
      "company": {
        "slug": "orbit-inc",
        "name": "Orbit Inc.",
        "logoUrl": "https://orbit-inc.example.com/logo.png"
      },
      "toolCategories": [
        "IMAGE_GENERATION",
        "PRODUCTIVITY"
      ],
      "categories": [
        { "slug": "ai-generators", "name": "AI Generators" },
        { "slug": "productivity", "name": "Productivity" }
      ],
      "tags": [
        { "slug": "text-to-image", "name": "Text to Image" },
        { "slug": "cool", "name": "Cool" }
      ],
      "integrations": [
        { "slug": "slack", "name": "Slack", "logoUrl": "https://slack.com/logo.png" },
        { "slug": "figma", "name": "Figma" }
      ],
      "tasks": [
        { "slug": "image-generation", "name": "Image Generation" },
        { "slug": "design" }
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
