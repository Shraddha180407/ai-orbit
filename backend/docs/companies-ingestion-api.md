# Companies Ingestion API Documentation

This document outlines how the Data Team can programmatically ingest or update companies in the `ai-orbit` database.

## Overview
- **Endpoint**: `POST /api/ingestion/companies`
- **Content-Type**: `application/json`
- **Authentication**: Requires a Bearer token in the `Authorization` header.

```http
Authorization: Bearer <INGESTION_TOKEN>
```

## Behavior
This API acts as an **upsert**.
- It matches companies based on their `slug`.
- If a company already exists, its fields will be updated with the provided payload.
- Any provided tool slugs or model slugs in the payload will be used to automatically link existing `Tool` and `AIModel` records in the database to this company.

## Schema Details

The API expects a top-level JSON object containing a `companies` array.

### Company Object

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | **Yes** | Unique identifier for the company. Used for upserts. |
| `name` | `string` | **Yes** | Display name of the company. |
| `logoUrl` | `string` (URL) | No | Primary URL to the company's logo. |
| `description` | `string` | No | Description of the company. |
| `website` | `string` (URL) | No | Official website URL. |
| `country` | `string` | No | Country of origin or headquarters. |
| `city` | `string` | No | City of headquarters. |
| `foundedYear` | `number` (Int) | No | Year the company was founded. |
| `type` | `string[]` | No | Array of company types. Valid values: `AI_NATIVE`, `MODEL_COMPANIES`, `TOOL_COMPANIES`, `PROFITABLE`, `UNICORNS`. Default is `[]`. |
| `sector` | `string` | No | Primary industry sector. |
| `verified` | `boolean` | No | Verification status. Default is `false`. |
| `featured` | `boolean` | No | Featured status. Default is `false`. |
| `valuation` | `number` | No | Company valuation in USD. |
| `fundingRaised` | `number` | No | Total funding raised in USD. |
| `latestFundingRound` | `string` | No | Name of the latest funding round, e.g. "Series C". |
| `employeeCount` | `number` (Int) | No | Estimated number of employees. |
| `linkedinUrl` | `string` (URL) | No | LinkedIn profile URL. |
| `twitterUrl` | `string` (URL) | No | Twitter/X profile URL. |
| `views` | `number` (Int) | No | Total views count. Default is `0`. |
| `upvotes` | `number` (Int) | No | Total upvotes count. Default is `0`. |
| `impressions` | `number` (Int) | No | Total impressions count. Default is `0`. |
| `tools` | `string[]` | No | Array of tool **slugs** to link to this company. |
| `aiModels` | `string[]` | No | Array of AI model **slugs** to link to this company. |

---

## Sample Payload

```json
{
  "companies": [
    {
      "slug": "openai",
      "name": "OpenAI",
      "logoUrl": "https://openai.com/logo.png",
      "description": "An AI research and deployment company dedicated to ensuring that artificial general intelligence benefits all of humanity.",
      "website": "https://openai.com",
      "country": "US",
      "city": "San Francisco",
      "foundedYear": 2015,
      "type": ["AI_NATIVE", "MODEL_COMPANIES", "UNICORNS"],
      "sector": "Artificial Intelligence",
      "verified": true,
      "valuation": 86000000000,
      "fundingRaised": 11300000000,
      "latestFundingRound": "Secondary Market",
      "employeeCount": 770,
      "linkedinUrl": "https://www.linkedin.com/company/openai",
      "twitterUrl": "https://twitter.com/OpenAI",
      "tools": ["chatgpt", "dall-e"],
      "aiModels": ["gpt-4o", "gpt-3.5-turbo"]
    }
  ]
}
```

## Responses
- **200 OK**: Successfully processed the payload. Returns a summary object detailing the number of items processed, created, updated, and any errors encountered during the transaction.
- **422 Unprocessable Entity**: The provided payload failed Zod schema validation. The response will include an `issues` array detailing the specific validation failures.
- **401 Unauthorized**: Missing or incorrectly formatted `Authorization` header.
- **403 Forbidden**: Provided token does not match the server's `INGESTION_TOKEN`.
