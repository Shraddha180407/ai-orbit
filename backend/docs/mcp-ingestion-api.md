# MCP Ingestion API Documentation

This document outlines how the Data Team can programmatically ingest or update MCP directory items in the `ai-orbit` database.

## Overview
- **Endpoint**: `POST /api/ingestion/mcp`
- **Content-Type**: `application/json`
- **Authentication**: Requires a Bearer token in the `Authorization` header.

```http
Authorization: Bearer <INGESTION_TOKEN>
```

## Behavior
This API acts as an **upsert**.
- It matches MCP items based on their `slug`.
- Any connected entities (`categories`, `subCategories`, `tags`) provided in the payload are also automatically upserted based on their `slug`s.
- If an MCP item already exists, its primitive fields are updated and its relations are fully replaced by the payload contents.

## Schema Details
The API expects a top-level JSON object containing an `items` array.

### MCP Item Object
| Field | Type | Required | Description |
|---|---|---|---|
| `itemType` | `"SERVER"` or `"CLIENT"` | **Yes** | MCP item type. |
| `name` | `string` | **Yes** | Display name. |
| `slug` | `string` | **Yes** | Unique identifier. |
| `logoUrl` | `string` (URL) | No | Item logo. |
| `coverImageUrl` | `string` (URL) | No | Cover image. |
| `shortDescription` | `string` | **Yes** | Short summary. |
| `fullDescription` | `string` | **Yes** | Detailed description. |
| `providerName` | `string` | **Yes** | Provider or publisher name. |
| `providerUrl` | `string` (URL) | No | Provider website. |
| `license` | `string` | No | License text. |
| `pricingType` | `"FREE"`, `"FREEMIUM"`, `"PAID"` | **Yes** | Pricing tier. |
| `startingPrice` | `number` | No | Numeric starting price. |
| `isFeatured` | `boolean` | No | Featured flag. Default is `false`. |
| `isVerified` | `boolean` | No | Verified flag. Default is `false`. |
| `launchDate` | `string` (ISO date) | No | Launch date. |
| `lastUpdatedDate` | `string` (ISO date) | No | Last updated timestamp. |
| `websiteUrl` | `string` (URL) | No | Website URL. |
| `documentationUrl` | `string` (URL) | No | Documentation URL. |
| `repositoryUrl` | `string` (URL) | No | Repository URL. |
| `qualityScore` | `number` | No | Quality score. |
| `easeOfUseScore` | `number` | No | Ease-of-use score. |
| `globalRank` | `number` | No | Global rank position. |
| `leaderboardRank` | `number` | No | Leaderboard rank position. |
| `editorialVerdict` | `string` | No | Editorial verdict text. |
| `viewCount` | `number` | No | View count. Default is `0`. |
| `monthlyVisits` | `number` | No | Monthly visit count. Default is `0`. |
| `upvoteCount` | `number` | No | Upvote count. Default is `0`. |
| `saveCount` | `number` | No | Save count. Default is `0`. |
| `categories` | `object[]` | No | Categories to attach. |
| `subCategories` | `object[]` | No | Subcategories to attach; each must include a parent `categorySlug`. |
| `tags` | `object[]` | No | Tags to attach. |
| `technicalSpecs` | `object[]` | No | Technical specification entries. |
| `installationGuides` | `object[]` | No | Installation guide steps. |
| `features` | `object[]` | No | Feature records. |
| `useCases` | `object[]` | No | Use case records. |
| `pricingPlans` | `object[]` | No | Pricing plan entries. |
| `faqs` | `object[]` | No | FAQ entries. |

### Category Object
| Field | Type | Required |
|---|---|---|
| `slug` | `string` | **Yes** |
| `name` | `string` | **Yes** |
| `description` | `string` | No |

### Subcategory Object
| Field | Type | Required |
|---|---|---|
| `slug` | `string` | **Yes** |
| `name` | `string` | **Yes** |
| `description` | `string` | No |
| `categorySlug` | `string` | **Yes** |

### Tag Object
| Field | Type | Required |
|---|---|---|
| `slug` | `string` | **Yes** |
| `name` | `string` | **Yes** |

### Technical Spec Object
| Field | Type | Required |
|---|---|---|
| `supportedPlatforms` | `string[]` | No |
| `compatibility` | `string` | **Yes** |
| `integrations` | `string[]` | No |
| `localBindingControls` | `string` | **Yes** |

### Installation Guide Object
| Field | Type | Required |
|---|---|---|
| `stepNumber` | `number` | **Yes** |
| `title` | `string` | **Yes** |
| `codeSnippet` | `string` | **Yes** |
| `instructions` | `string` | **Yes** |

### Feature Object
| Field | Type | Required |
|---|---|---|
| `title` | `string` | **Yes** |
| `description` | `string` | **Yes** |
| `icon` | `string` | No |
| `badge` | `string` | No |

### Use Case Object
| Field | Type | Required |
|---|---|---|
| `title` | `string` | **Yes** |
| `description` | `string` | **Yes** |
| `applications` | `string[]` | No |

### Pricing Plan Object
| Field | Type | Required |
|---|---|---|
| `planName` | `string` | **Yes** |
| `price` | `number` | **Yes** |
| `billingCycle` | `string` | **Yes** |
| `featuresList` | `string[]` | No |

### FAQ Object
| Field | Type | Required |
|---|---|---|
| `question` | `string` | **Yes** |
| `answer` | `string` | **Yes** |

## Sample Payload
```json
{
  "items": [
    {
      "itemType": "SERVER",
      "name": "Anthropic MCP Server",
      "slug": "anthropic-mcp-server",
      "shortDescription": "Official MCP server for Anthropic Claude models",
      "fullDescription": "The Anthropic MCP Server provides seamless integration...",
      "providerName": "Anthropic",
      "pricingType": "FREE",
      "isFeatured": true,
      "isVerified": true,
      "websiteUrl": "https://github.com/anthropics/mcp-server",
      "documentationUrl": "https://docs.anthropic.com/claude/docs/mcp",
      "repositoryUrl": "https://github.com/anthropics/mcp-server",
      "categories": [{ "slug": "mcp-servers", "name": "MCP Servers" }],
      "subCategories": [{ "slug": "core-mcp-servers", "name": "Core MCP Servers", "categorySlug": "mcp-servers" }],
      "tags": [{ "slug": "open-source", "name": "Open Source" }],
      "technicalSpecs": [{ "supportedPlatforms": ["macOS", "Windows", "Linux"], "compatibility": "Node.js 18+, Python 3.8+", "integrations": ["Claude"], "localBindingControls": "Env vars" }],
      "installationGuides": [{ "stepNumber": 1, "title": "Install dependencies", "codeSnippet": "npm install @anthropic-ai/mcp-server", "instructions": "Install the MCP server package." }],
      "features": [{ "title": "Tool Calling", "description": "Execute tools via MCP." }],
      "useCases": [{ "title": "Productivity", "description": "Integrate MCP into workflows." }],
      "pricingPlans": [{ "planName": "Free", "price": 0, "billingCycle": "MONTHLY", "featuresList": ["Basic access"] }],
      "faqs": [{ "question": "How do I install?", "answer": "Use npm install." }]
    }
  ]
}
```

## Responses
- **200 OK**: Successfully processed the payload and returns summary.
- **422 Unprocessable Entity**: Validation failed.
- **401 Unauthorized**: Missing or invalid `Authorization` header.
- **500 Internal Server Error**: Unexpected server error.
