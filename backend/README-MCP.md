# MCP Directory Platform

A comprehensive REST API service for showcasing and managing MCP (Model Context Protocol) Servers and MCP Clients. Built with TypeScript, Hono, Prisma ORM, and PostgreSQL.

## 🚀 Features

### Core Functionality
- **MCP Item Management**: Support for both MCP Servers and MCP Clients
- **Rich Content**: Detailed descriptions, technical specs, installation guides, features, and use cases
- **User Interactions**: Upvoting, saving, viewing, and reviewing MCP items
- **Community Features**: Discussions, FAQs, and editorial reviews
- **Advanced Filtering**: Filter by type, category, pricing, search, and sort options
- **Analytics**: Track views, upvotes, saves, and engagement metrics
- **Authentication**: JWT-based authentication for user interactions
- **Rate Limiting**: Built-in rate limiting for public endpoints

### Technical Specifications
- **Database**: PostgreSQL with Prisma ORM
- **Framework**: Hono (Fast and lightweight web framework)
- **Language**: TypeScript with strict type checking
- **Authentication**: JWT-based authentication
- **Validation**: Zod schema validation
- **Error Handling**: Structured error responses
- **Testing**: Vitest for unit testing
- **Deployment**: Cloudflare Workers ready

## 📊 Database Schema

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

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Prisma CLI
- TypeScript

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and API keys
   ```

4. **Generate Prisma client**
   ```bash
   npm run prisma generate
   ```

5. **Push schema to database**
   ```bash
   npm run prisma db push
   ```

6. **Seed the database with MCP data**
   ```bash
   npm run seed-mcp
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/aiorbit"

# Authentication
JWT_SECRET="your-jwt-secret"

# Cloudflare (for deployment)
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_API_TOKEN="your-api-token"

# Optional: External API keys
GEMINI_API_KEY="your-gemini-api-key"
GROQ_API_KEY="your-groq-api-key"
```

## 📚 API Documentation

### Base URL
```
https://api.aiorbit.club/api/v1/mcps
```

### Key Endpoints

#### Public Directory & Listing APIs
- `GET /api/v1/mcps` - Fetch paginated MCP listings with filtering
- `GET /api/v1/mcps/:slug` - Fetch detailed MCP item with all relations
- `GET /api/v1/mcps/:slug/alternatives` - Fetch top alternative MCP items

#### User Interaction APIs
- `POST /api/v1/mcps/:id/upvote` - Toggle upvote for an MCP item
- `POST /api/v1/mcps/:id/save` - Save/bookmark an MCP item
- `POST /api/v1/mcps/:id/views` - Increment view count

#### Community & Review APIs
- `GET /api/v1/mcps/:id/reviews` - Get user reviews and statistics
- `POST /api/v1/mcps/:id/reviews` - Submit a user review
- `GET /api/v1/mcps/:id/discussions` - Get community discussions
- `POST /api/v1/mcps/:id/discussions` - Create a discussion post

#### Management & Claim APIs
- `POST /api/v1/mcps/:id/claim` - Submit a claim request
- `POST /api/v1/mcps/:id/report` - Report an item issue

For detailed API documentation, see [docs/mcp-directory-api.md](./docs/mcp-directory-api.md).

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Cloudflare Workers

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### Docker

```bash
# Build the Docker image
docker build -t mcp-directory-platform .

# Run the container
docker run -p 8787:8787 mcp-directory-platform
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   └── mcp/                 # MCP Directory Platform module
│   │       ├── controller/       # Request handlers
│   │       ├── service/         # Business logic
│   │       ├── validator/       # Input validation
│   │       ├── types/           # TypeScript types
│   │       └── middleware/      # Custom middleware
│   ├── lib/                     # Shared utilities
│   └── index.ts                 # Main application entry
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed-mcp.ts             # MCP data seeding
│   └── migrations/             # Database migrations
├── scripts/
│   └── migrate-mcp.ts          # Migration script
├── docs/
│   └── mcp-directory-api.md    # API documentation
├── package.json
└── wrangler.toml               # Cloudflare configuration
```

## 🔧 Development Workflow

### Adding New MCP Items

1. **Via API** (recommended)
   ```bash
   curl -X POST https://api.aiorbit.club/api/v1/mcps \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <jwt-token>" \
     -d '{
       "itemType": "SERVER",
       "name": "New MCP Server",
       "slug": "new-mcp-server",
       "shortDescription": "Description",
       "fullDescription": "Full description...",
       "providerName": "Provider Name",
       "pricingType": "FREE"
     }'
   ```

2. **Via Database** (for bulk imports)
   ```sql
   INSERT INTO mcp_items (item_type, name, slug, ...) VALUES ('SERVER', 'New MCP Server', 'new-mcp-server', ...);
   ```

### Updating Existing Items

```bash
curl -X PUT https://api.aiorbit.club/api/v1/mcps/:slug \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "name": "Updated Name",
    "shortDescription": "Updated description"
  }'
```

### Customizing Categories and Tags

1. **Add new categories**
   ```typescript
   // In prisma/schema.prisma
   model Category {
     id String @id @default(cuid())
     name String
     slug String @unique
     // ... other fields
   }
   ```

2. **Update seed data**
   ```typescript
   // In prisma/seed-mcp.ts
   await prisma.category.create({
     data: {
       name: 'New Category',
       slug: 'new-category',
       // ... other fields
     }
   });
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Write tests for all new features
- Follow the existing code style
- Update documentation as needed

## 📊 Monitoring and Analytics

### Key Metrics
- **API Response Times**: Monitor for performance issues
- **Error Rates**: Track and investigate errors
- **User Engagement**: Track upvotes, saves, and views
- **Content Quality**: Monitor review scores and feedback

### Logging
```typescript
// Example structured logging
logger.info('MCP item viewed', {
  itemId: item.id,
  itemType: item.itemType,
  userAgent: c.req.header('user-agent'),
  ip: c.req.header('x-forwarded-for')
});
```

## 🔒 Security Considerations

### Authentication
- JWT tokens with expiration
- Secure password hashing (bcrypt)
- Rate limiting on authentication endpoints

### Data Validation
- Zod schema validation for all inputs
- SQL injection prevention via Prisma ORM
- XSS protection via proper escaping

### Rate Limiting
- Public endpoints: 100 requests/minute
- Authentication endpoints: 5 requests/minute
- View increment: 10 requests/minute per IP

### CORS Configuration
```typescript
app.use('*', cors({
  origin: (origin) => {
    // Allow specific domains
    if (origin === 'https://aiorbit.club' || origin.endsWith('.aiorbit.club')) {
      return origin;
    }
    return 'https://aiorbit.club';
  },
  credentials: true,
}));
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check database connection
   npm run prisma db seed
   ```

2. **Prisma Client Generation**
   ```bash
   # Regenerate client
   npm run prisma generate
   ```

3. **TypeScript Errors**
   ```bash
   # Check types
   npm run build
   ```

4. **API Errors**
   ```bash
   # Check logs
   npm run dev
   ```

### Debug Mode

Enable debug logging:
```typescript
// In src/lib/logger.js
export const logger = {
  info: (message, meta) => console.log(`[INFO] ${message}`, meta),
  error: (message, meta) => console.error(`[ERROR] ${message}`, meta),
  warn: (message, meta) => console.warn(`[WARN] ${message}`, meta),
};
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hono](https://hono.dev/) - Fast and lightweight web framework
- [Prisma](https://prisma.io/) - Next-generation ORM
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless platform

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the [documentation](./docs/)
- Contact the development team

---

Built with ❤️ by the AI Orbit team