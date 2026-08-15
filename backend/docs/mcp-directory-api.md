# MCP Directory Platform API Documentation

## Overview

The MCP Directory Platform is a comprehensive REST API service built with TypeScript, Hono, Prisma ORM, and PostgreSQL. It provides a complete solution for showcasing and managing MCP (Model Context Protocol) Servers and MCP Clients, allowing users to browse, filter, inspect details, interact with, review, upvote, and contribute MCP integrations.

## Features

- **MCP Item Management**: Support for both MCP Servers and MCP Clients
- **Rich Content**: Detailed descriptions, technical specs, installation guides, features, and use cases
- **User Interactions**: Upvoting, saving, viewing, and reviewing MCP items
- **Community Features**: Discussions, FAQs, and editorial reviews
- **Advanced Filtering**: Filter by type, category, pricing, search, and sort options
- **Analytics**: Track views, upvotes, saves, and engagement metrics
- **Authentication**: JWT-based authentication for user interactions
- **Rate Limiting**: Built-in rate limiting for public endpoints

## Database Schema

### Core Models

#### MCPItem
- **id**: UUID (Primary Key)
- **itemType**: Enum (`SERVER`, `CLIENT`)
- **name**, **slug**: String (Unique)
- **logoUrl**, **coverImageUrl**: String
- **shortDescription**: String
- **fullDescription**: Text / Rich Text Markdown
- **providerName**, **providerUrl**: String
- **license**: String
- **pricingType**: Enum (`FREE`, `FREEMIUM`, `PAID`)
- **startingPrice**: Decimal (Nullable)
- **isFeatured**, **isVerified**: Boolean
- **launchDate**, **lastUpdatedDate**: DateTime
- **websiteUrl**, **documentationUrl**, **repositoryUrl**: String
- **qualityScore**, **easeOfUseScore**: Float
- **globalRank**, **leaderboardRank**: Int
- **editorialVerdict**: Text (Nullable)
- **Analytics**: `viewCount`, `monthlyVisits`, `upvoteCount`, `saveCount`

#### Category & Tag Models
- **Category**: Main categories (MCP Servers, Developer Tools, etc.)
- **SubCategory**: Detailed subcategories under main categories
- **Tag**: Flexible tagging system for MCP items

#### Technical Specifications
- **TechnicalSpec**: Platform compatibility, integrations, binding controls
- **InstallationGuide**: Step-by-step installation instructions
- **MCPFeature**: Feature descriptions with icons and badges
- **MCPUseCase**: Practical applications and use cases

#### Pricing & Reviews
- **PricingPlan**: Multiple pricing plans with features
- **Review**: User reviews with ratings and comments
- **EditorialReview**: Expert reviews with grades and badges

#### Community Features
- **Discussion**: User discussions with replies and upvotes
- **FAQ**: Frequently asked questions
- **Upvote**: User upvotes with prevention of duplicates
- **SavedMCP**: User saved/bookmarked items

#### Management
- **Claim**: Tool ownership claims
- **Report**: Item reporting system

## API Endpoints

### Base URL
```
https://api.aiorbit.club/api/v1/mcps
```

### Public Directory & Listing APIs

#### GET /api/v1/mcps
Fetch paginated MCP listings with filtering and sorting.

**Query Parameters:**
- `type` (SERVER|CLIENT): Filter by item type
- `category`: Filter by category slug
- `subCategory`: Filter by subcategory slug
- `pricingType` (FREE|FREEMIUM|PAID): Filter by pricing
- `search`: Search in name, description, provider
- `sortBy` (trending|top-rated|most-upvoted|recently-updated): Sort order
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "itemType": "SERVER",
        "name": "Anthropic MCP Server",
        "slug": "anthropic-mcp-server",
        "shortDescription": "Official MCP server for Claude models",
        "fullDescription": "...",
        "providerName": "Anthropic",
        "pricingType": "FREE",
        "isFeatured": true,
        "isVerified": true,
        "viewCount": 15420,
        "upvoteCount": 892,
        "saveCount": 456,
        "categories": [...],
        "tags": [...],
        "features": [...],
        "reviews": [...],
        "discussions": [...]
      }
    ],
    "total": 100,
    "page": 1,
    "totalPages": 5
  }
}
```

#### GET /api/v1/mcps/:slug
Fetch detailed MCP item with all relations.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "itemType": "SERVER",
    "name": "Anthropic MCP Server",
    "slug": "anthropic-mcp-server",
    "shortDescription": "Official MCP server for Claude models",
    "fullDescription": "...",
    "providerName": "Anthropic",
    "pricingType": "FREE",
    "isFeatured": true,
    "isVerified": true,
    "viewCount": 15420,
    "upvoteCount": 892,
    "saveCount": 456,
    "categories": [...],
    "subCategories": [...],
    "tags": [...],
    "technicalSpecs": {
      "supportedPlatforms": ["macOS", "Windows", "Linux"],
      "compatibility": "Node.js 18+, Python 3.8+",
      "integrations": ["Claude", "OpenAI", "Local LLMs"],
      "localBindingControls": "Environment variables, configuration files"
    },
    "installationGuides": [
      {
        "stepNumber": 1,
        "title": "Install Dependencies",
        "codeSnippet": "npm install @anthropic-ai/mcp-server",
        "instructions": "Install the MCP server package using npm."
      }
    ],
    "features": [...],
    "useCases": [...],
    "pricingPlans": [...],
    "reviews": [...],
    "editorialReviews": [...],
    "discussions": [...],
    "faqs": [...],
    "alternatives": [...]
  }
}
```

#### GET /api/v1/mcps/:slug/alternatives
Fetch top alternative MCP items based on shared categories and tags.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "OpenAI MCP Server",
      "slug": "openai-mcp-server",
      "shortDescription": "MCP server for OpenAI GPT models",
      "upvoteCount": 623,
      "qualityScore": 4.5
    }
  ]
}
```

### User Interaction APIs

#### POST /api/v1/mcps/:id/upvote
Toggle upvote for an MCP item (requires authentication).

**Request:**
```json
{
  "id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "count": 893
  }
}
```

#### POST /api/v1/mcps/:id/save
Save/bookmark an MCP item (requires authentication).

**Request:**
```json
{
  "id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "saved": true
  }
}
```

#### POST /api/v1/mcps/:id/views
Increment view count for an MCP item.

**Request:**
```json
{
  "id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "View count incremented"
}
```

### Community & Review APIs

#### GET /api/v1/mcps/:id/reviews
Get user reviews and review statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "comment": "Excellent MCP server!",
        "createdAt": "2024-01-15T10:00:00Z",
        "user": {
          "id": "uuid",
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "statistics": {
      "totalReviews": 25,
      "averageRating": 4.6,
      "ratingDistribution": {
        "5": 15,
        "4": 8,
        "3": 2,
        "2": 0,
        "1": 0
      }
    }
  }
}
```

#### POST /api/v1/mcps/:id/reviews
Submit a user review (requires authentication).

**Request:**
```json
{
  "id": "uuid",
  "rating": 5,
  "comment": "Excellent MCP server with great Claude integration!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "rating": 5,
    "comment": "Excellent MCP server with great Claude integration!",
    "createdAt": "2024-01-15T10:00:00Z",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### GET /api/v1/mcps/:id/discussions
Get community discussion threads.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Best practices for MCP server development",
      "content": "What are the best practices when developing MCP servers?",
      "upvotes": 15,
      "createdAt": "2024-01-15T10:00:00Z",
      "user": {
        "id": "uuid",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "replies": [
        {
          "id": "uuid",
          "content": "I recommend focusing on error handling...",
          "upvotes": 3,
          "createdAt": "2024-01-15T11:00:00Z",
          "user": {
            "id": "uuid",
            "name": "Bob Johnson",
            "email": "bob@example.com"
          }
        }
      ]
    }
  ]
}
```

#### POST /api/v1/mcps/:id/discussions
Create a discussion post (requires authentication).

**Request:**
```json
{
  "id": "uuid",
  "title": "Best practices for MCP server development",
  "content": "What are the best practices when developing MCP servers?"
}
```

#### POST /api/v1/discussions/:replies
Create a discussion reply (requires authentication).

**Request:**
```json
{
  "discussionId": "uuid",
  "content": "I recommend focusing on error handling and performance optimization."
}
```

### Management & Claim APIs

#### POST /api/v1/mcps/:id/claim
Submit a claim request for an MCP item.

**Request:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "relationship": "Developer",
  "message": "I am the developer of this MCP server and would like to claim ownership."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "relationship": "Developer",
    "message": "I am the developer of this MCP server and would like to claim ownership.",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

#### POST /api/v1/mcps/:id/report
Report an MCP item issue (requires authentication).

**Request:**
```json
{
  "id": "uuid",
  "reason": "Incorrect information",
  "description": "The documentation contains outdated information about the API."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "reporterId": "uuid",
    "reportedMCPItemId": "uuid",
    "reason": "Incorrect information",
    "description": "The documentation contains outdated information about the API.",
    "status": "OPEN",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

## Authentication

All endpoints that modify data require JWT authentication. The JWT should be included in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## Error Handling

The API uses structured error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server error

## Rate Limiting

Public endpoints are rate limited to prevent abuse:
- `/api/v1/mcps`: 100 requests per minute
- `/api/v1/mcps/:slug`: 200 requests per minute
- View increment endpoint: 10 requests per minute per IP

## Data Models

### MCPItem
```typescript
interface MCPItem {
  id: string;
  itemType: 'SERVER' | 'CLIENT';
  name: string;
  slug: string;
  logoUrl?: string;
  coverImageUrl?: string;
  shortDescription: string;
  fullDescription: string;
  providerName: string;
  providerUrl?: string;
  license?: string;
  pricingType: 'FREE' | 'FREEMIUM' | 'PAID';
  startingPrice?: number;
  isFeatured: boolean;
  isVerified: boolean;
  launchDate?: Date;
  lastUpdatedDate: Date;
  websiteUrl?: string;
  documentationUrl?: string;
  repositoryUrl?: string;
  qualityScore?: number;
  easeOfUseScore?: number;
  globalRank?: number;
  leaderboardRank?: number;
  editorialVerdict?: string;
  viewCount: number;
  monthlyVisits: number;
  upvoteCount: number;
  saveCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Review
```typescript
interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
}
```

### Discussion
```typescript
interface Discussion {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
  replies?: DiscussionReply[];
}
```

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Prisma CLI
- TypeScript

### Installation
```bash
cd backend
npm install
npm run prisma generate
npm run prisma db push
npm run seed-mcp
npm run dev
```

### Environment Variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/aiorbit"
JWT_SECRET="your-jwt-secret"
```

## Testing

```bash
npm test
npm run test:coverage
```

## Deployment

The platform is designed to deploy on Cloudflare Workers:

```bash
npm run build
npm run deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.