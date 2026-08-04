import "dotenv/config";
import { MCPItemType, MCPPricingType } from '@prisma/client';

import { getPrisma } from "../src/lib/prisma.js";   // adjust path

const prisma = getPrisma({});

async function main() {
  console.log('🚀 Seeding MCP Directory Platform...');

  // Create categories
  const categories = await Promise.all([
    prisma.mCPDirectoryCategory.create({
      data: {
        name: 'MCP Servers',
        slug: 'mcp-servers',
        description: 'Model Context Protocol servers that provide tools and capabilities',
        icon: 'server',
        color: '#3B82F6',
      },
    }),
    prisma.mCPDirectoryCategory.create({
      data: {
        name: 'Developer Tools',
        slug: 'developer-tools',
        description: 'Tools for developers to build and test MCP integrations',
        icon: 'code',
        color: '#10B981',
      },
    }),
    prisma.mCPDirectoryCategory.create({
      data: {
        name: 'Databases',
        slug: 'databases',
        description: 'Database integrations for MCP',
        icon: 'database',
        color: '#8B5CF6',
      },
    }),
    prisma.mCPDirectoryCategory.create({
      data: {
        name: 'File Systems',
        slug: 'file-systems',
        description: 'File system integrations and storage solutions',
        icon: 'folder',
        color: '#F59E0B',
      },
    }),
    prisma.mCPDirectoryCategory.create({
      data: {
        name: 'Productivity',
        slug: 'productivity',
        description: 'Productivity and workflow automation tools',
        icon: 'check-circle',
        color: '#EF4444',
      },
    }),
    prisma.mCPDirectoryCategory.create({
      data: {
        name: 'APIs',
        slug: 'apis',
        description: 'API integrations and service connectors',
        icon: 'plug',
        color: '#06B6D4',
      },
    }),
    prisma.mCPDirectoryCategory.create({
      data: {
        name: 'Cloud',
        slug: 'cloud',
        description: 'Cloud service integrations and deployment tools',
        icon: 'cloud',
        color: '#6366F1',
      },
    }),
    prisma.mCPDirectoryCategory.create({
      data: {
        name: 'ML Platforms',
        slug: 'ml-platforms',
        description: 'Machine learning and AI platform integrations',
        icon: 'brain',
        color: '#EC4899',
      },
    }),
    prisma.mCPDirectoryCategory.create({
      data: {
        name: 'Browser',
        slug: 'browser',
        description: 'Browser extensions and web-based tools',
        icon: 'globe',
        color: '#84CC16',
      },
    }),
    prisma.mCPDirectoryCategory.create({
      data: {
        name: 'Community',
        slug: 'community',
        description: 'Community-driven tools and open-source projects',
        icon: 'users',
        color: '#F97316',
      },
    }),
  ]);

  // Create subcategories
  const subcategories = await Promise.all([
    // MCP Servers subcategories
    prisma.mCPDirectorySubCategory.create({
      data: {
        name: 'Core MCP Servers',
        slug: 'core-mcp-servers',
        description: 'Core MCP server implementations',
        categoryId: categories[0].id,
      },
    }),
    prisma.mCPDirectorySubCategory.create({
      data: {
        name: 'Specialized MCP Servers',
        slug: 'specialized-mcp-servers',
        description: 'Specialized servers for specific domains',
        categoryId: categories[0].id,
      },
    }),
    // Developer Tools subcategories
    prisma.mCPDirectorySubCategory.create({
      data: {
        name: 'SDKs & Frameworks',
        slug: 'sdks-frameworks',
        description: 'Software development kits and frameworks',
        categoryId: categories[1].id,
      },
    }),
    prisma.mCPDirectorySubCategory.create({
      data: {
        name: 'Testing Tools',
        slug: 'testing-tools',
        description: 'Testing and debugging tools',
        categoryId: categories[1].id,
      },
    }),
  ]);

  // Create tags
  const tags = await Promise.all([
    prisma.mCPDirectoryTag.create({ data: { name: 'open-source', slug: 'open-source' } }),
    prisma.mCPDirectoryTag.create({ data: { name: 'commercial', slug: 'commercial' } }),
    prisma.mCPDirectoryTag.create({ data: { name: 'ai-powered', slug: 'ai-powered' } }),
    prisma.mCPDirectoryTag.create({ data: { name: 'real-time', slug: 'real-time' } }),
    prisma.mCPDirectoryTag.create({ data: { name: 'async', slug: 'async' } }),
    prisma.mCPDirectoryTag.create({ data: { name: 'typescript', slug: 'typescript' } }),
    prisma.mCPDirectoryTag.create({ data: { name: 'python', slug: 'python' } }),
    prisma.mCPDirectoryTag.create({ data: { name: 'javascript', slug: 'javascript' } }),
    prisma.mCPDirectoryTag.create({ data: { name: 'rust', slug: 'rust' } }),
    prisma.mCPDirectoryTag.create({ data: { name: 'go', slug: 'go' } }),
  ]);

  // Create sample MCP items
  const mcpItems = await Promise.all([
    // MCP Server Example
    prisma.mCPItem.create({
      data: {
        itemType: MCPItemType.SERVER,
        name: 'Anthropic MCP Server',
        slug: 'anthropic-mcp-server',
        shortDescription: 'Official MCP server for Anthropic Claude models',
        fullDescription: `The Anthropic MCP Server provides seamless integration with Claude models through the Model Context Protocol. This server enables bidirectional communication between Claude and your applications, allowing Claude to access tools, data, and custom capabilities.

Key features include:
- Native Claude integration
- Tool calling capabilities
- Context management
- Streaming support
- Authentication and security`,
        providerName: 'Anthropic',
        providerUrl: 'https://anthropic.com',
        license: 'MIT',
        pricingType: MCPPricingType.FREE,
        isFeatured: true,
        isVerified: true,
        launchDate: new Date('2024-01-15'),
        websiteUrl: 'https://github.com/anthropics/mcp-server',
        documentationUrl: 'https://docs.anthropic.com/claude/docs/mcp',
        repositoryUrl: 'https://github.com/anthropics/mcp-server',
        qualityScore: 4.8,
        easeOfUseScore: 4.5,
        globalRank: 1,
        editorialVerdict: 'Excellent MCP server with comprehensive Claude integration and robust tool support.',
        viewCount: 15420,
        monthlyVisits: 3240,
        upvoteCount: 892,
        saveCount: 456,
        
        // Relations
        categories: {
          create: [
            {
              categoryId: categories[0].id, // MCP Servers
            },
          ],
        },
        subCategories: {
          create: [
            {
              subCategoryId: subcategories[0].id, // Core MCP Servers
            },
          ],
        },
        tags: {
          create: [
            { tagId: tags[0].id }, // open-source
            { tagId: tags[2].id }, // ai-powered
            { tagId: tags[5].id }, // typescript
          ],
        },
        technicalSpecs: {
          create: {
            supportedPlatforms: ['macOS', 'Windows', 'Linux'],
            compatibility: 'Node.js 18+, Python 3.8+',
            integrations: ['Claude', 'OpenAI', 'Local LLMs'],
            localBindingControls: 'Environment variables, configuration files',
          },
        },
        installationGuides: {
          create: [
            {
              stepNumber: 1,
              title: 'Install Dependencies',
              codeSnippet: `npm install @anthropic-ai/mcp-server`,
              instructions: 'Install the MCP server package using npm.',
            },
            {
              stepNumber: 2,
              title: 'Configure Server',
              codeSnippet: `{
  "server": {
    "command": "npx",
    "args": ["@anthropic-ai/mcp-server"],
    "env": {
      "ANTHROPIC_API_KEY": "your-api-key"
    }
  }
}`,
              instructions: 'Configure the server with your API key and settings.',
            },
            {
              stepNumber: 3,
              title: 'Connect to Claude',
              codeSnippet: `claude --mcp-server anthropic`,
              instructions: 'Connect Claude to the MCP server using the CLI.',
            },
          ],
        },
        features: {
          create: [
            {
              title: 'Tool Calling',
              description: 'Execute tools and functions through Claude',
              icon: 'tool',
              badge: 'Core',
            },
            {
              title: 'Context Management',
              description: 'Maintain conversation context and memory',
              icon: 'memory',
              badge: 'Advanced',
            },
            {
              title: 'Streaming Support',
              description: 'Real-time streaming responses',
              icon: 'stream',
              badge: 'Performance',
            },
          ],
        },
        useCases: {
          create: [
            {
              title: 'AI Agent Development',
              description: 'Build intelligent agents with Claude capabilities',
              applications: ['Chatbots', 'Virtual Assistants', 'Automation'],
            },
            {
              title: 'Data Processing',
              description: 'Process and analyze data using Claude',
              applications: ['Data Analysis', 'Report Generation', 'Content Creation'],
            },
          ],
        },
        pricingPlans: {
          create: {
            planName: 'Free Tier',
            price: 0,
            billingCycle: 'MONTHLY',
            featuresList: ['Basic tool calling', 'Standard context', 'Community support'],
          },
        },
        editorialReviews: {
          create: {
            grade: 'AA',
            verdict: 'Outstanding MCP server with excellent Claude integration and comprehensive tool support.',
            reviewDate: new Date('2024-06-15'),
            badge: 'Recommended',
            notes: 'Best-in-class for Claude-based applications.',
          },
        },
      },
    }),

    // MCP Client Example
    prisma.mCPItem.create({
      data: {
        itemType: MCPItemType.CLIENT,
        name: 'VSCode MCP Extension',
        slug: 'vscode-mcp-extension',
        shortDescription: 'VS Code extension for MCP development and testing',
        fullDescription: `The VSCode MCP Extension provides a comprehensive development environment for MCP (Model Context Protocol) development. This extension enables you to test, debug, and develop MCP servers and clients directly in your VS Code editor.

Key features include:
- MCP server testing
- Client development tools
- Protocol debugging
- Integration with popular AI models
- Real-time collaboration`,
        providerName: 'VSCode Marketplace',
        providerUrl: 'https://marketplace.visualstudio.com',
        license: 'MIT',
        pricingType: MCPPricingType.FREE,
        isFeatured: true,
        isVerified: true,
        launchDate: new Date('2024-03-20'),
        websiteUrl: 'https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-mcp',
        documentationUrl: 'https://github.com/microsoft/vscode-mcp-extension',
        repositoryUrl: 'https://github.com/microsoft/vscode-mcp-extension',
        qualityScore: 4.6,
        easeOfUseScore: 4.7,
        globalRank: 2,
        editorialVerdict: 'Excellent development tool for MCP integration with VS Code.',
        viewCount: 12340,
        monthlyVisits: 2890,
        upvoteCount: 756,
        saveCount: 389,
        
        // Relations
        categories: {
          create: [
            {
              categoryId: categories[1].id, // Developer Tools
            },
          ],
        },
        subCategories: {
          create: [
            {
              subCategoryId: subcategories[2].id, // SDKs & Frameworks
            },
          ],
        },
        tags: {
          create: [
            { tagId: tags[0].id }, // open-source
            { tagId: tags[5].id }, // typescript
            { tagId: tags[7].id }, // javascript
          ],
        },
        technicalSpecs: {
          create: {
            supportedPlatforms: ['Windows', 'macOS', 'Linux'],
            compatibility: 'VS Code 1.80+',
            integrations: ['Claude', 'OpenAI', 'Local LLMs', 'VS Code APIs'],
            localBindingControls: 'VS Code settings, workspace configuration',
          },
        },
        installationGuides: {
          create: [
            {
              stepNumber: 1,
              title: 'Install Extension',
              codeSnippet: `# Install from VS Code Marketplace
# Or using command palette
ext install ms-vscode.vscode-mcp`,
              instructions: 'Install the MCP extension from VS Code Marketplace.',
            },
            {
              stepNumber: 2,
              title: 'Configure MCP Server',
              codeSnippet: `{
  "mcp.servers": {
    "anthropic": {
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server"]
    }
  }
}`,
              instructions: 'Configure your MCP servers in VS Code settings.',
            },
          ],
        },
        features: {
          create: [
            {
              title: 'Server Testing',
              description: 'Test MCP servers with interactive debugging',
              icon: 'bug',
              badge: 'Development',
            },
            {
              title: 'Client Development',
              description: 'Build MCP clients with built-in tools',
              icon: 'code',
              badge: 'Development',
            },
            {
              title: 'Protocol Inspector',
              description: 'Inspect MCP protocol messages and responses',
              icon: 'search',
              badge: 'Debugging',
            },
          ],
        },
        useCases: {
          create: [
            {
              title: 'MCP Development',
              description: 'Develop and test MCP servers and clients',
              applications: ['Server Development', 'Client Integration', 'Protocol Testing'],
            },
            {
              title: 'AI Integration',
              description: 'Integrate AI models into development workflows',
              applications: ['Code Generation', 'Documentation', 'Testing'],
            },
          ],
        },
        pricingPlans: {
          create: {
            planName: 'Free',
            price: 0,
            billingCycle: 'MONTHLY',
            featuresList: ['Basic MCP support', 'Server testing', 'Client tools'],
          },
        },
        editorialReviews: {
          create: {
            grade: 'A_PLUS',
            verdict: 'Essential tool for MCP development with excellent VS Code integration.',
            reviewDate: new Date('2024-07-01'),
            badge: 'Editor\'s Choice',
            notes: 'Must-have for MCP developers.',
          },
        },
      },
    }),

    // Another MCP Server Example
    prisma.mCPItem.create({
      data: {
        itemType: MCPItemType.SERVER,
        name: 'OpenAI MCP Server',
        slug: 'openai-mcp-server',
        shortDescription: 'MCP server for OpenAI GPT models and tools',
        fullDescription: `The OpenAI MCP Server provides integration with OpenAI's GPT models and tools through the Model Context Protocol. This server enables Claude and other AI assistants to access OpenAI's capabilities including GPT-4, DALL-E, and various AI tools.

Key features include:
- GPT-4 and GPT-3.5 integration
- DALL-E image generation
- Function calling support
- Multi-modal capabilities
- Rate limiting and caching`,
        providerName: 'OpenAI',
        providerUrl: 'https://openai.com',
        license: 'MIT',
        pricingType: MCPPricingType.FREEMIUM,
        startingPrice: 20,
        isFeatured: true,
        isVerified: true,
        launchDate: new Date('2024-02-10'),
        websiteUrl: 'https://github.com/openai/mcp-server',
        documentationUrl: 'https://platform.openai.com/docs/mcp',
        repositoryUrl: 'https://github.com/openai/mcp-server',
        qualityScore: 4.5,
        easeOfUseScore: 4.3,
        globalRank: 3,
        editorialVerdict: 'Solid MCP server with comprehensive OpenAI integration and multi-modal capabilities.',
        viewCount: 9870,
        monthlyVisits: 2150,
        upvoteCount: 623,
        saveCount: 298,
        
        // Relations
        categories: {
          create: [
            {
              categoryId: categories[0].id, // MCP Servers
            },
          ],
        },
        subCategories: {
          create: [
            {
              subCategoryId: subcategories[0].id, // Core MCP Servers
            },
          ],
        },
        tags: {
          create: [
            { tagId: tags[0].id }, // open-source
            { tagId: tags[2].id }, // ai-powered
            { tagId: tags[5].id }, // typescript
          ],
        },
        technicalSpecs: {
          create: {
            supportedPlatforms: ['macOS', 'Windows', 'Linux'],
            compatibility: 'Node.js 18+, Python 3.8+',
            integrations: ['GPT-4', 'GPT-3.5', 'DALL-E', 'OpenAI APIs'],
            localBindingControls: 'API keys, environment variables',
          },
        },
        installationGuides: {
          create: [
            {
              stepNumber: 1,
              title: 'Install Package',
              codeSnippet: `npm install @openai/mcp-server`,
              instructions: 'Install the OpenAI MCP server package.',
            },
            {
              stepNumber: 2,
              title: 'Set API Key',
              codeSnippet: `export OPENAI_API_KEY="your-api-key"`,
              instructions: 'Set your OpenAI API key in the environment.',
            },
          ],
        },
        features: {
          create: [
            {
              title: 'GPT Integration',
              description: 'Access GPT-4 and GPT-3.5 models',
              icon: 'brain',
              badge: 'AI',
            },
            {
              title: 'DALL-E Support',
              description: 'Generate images with DALL-E',
              icon: 'image',
              badge: 'Creative',
            },
            {
              title: 'Function Calling',
              description: 'Execute functions and tools',
              icon: 'tool',
              badge: 'Core',
            },
          ],
        },
        useCases: {
          create: [
            {
              title: 'Content Creation',
              description: 'Generate text, code, and images',
              applications: ['Writing', 'Design', 'Development'],
            },
            {
              title: 'Data Analysis',
              description: 'Analyze and process data',
              applications: ['Research', 'Analytics', 'Insights'],
            },
          ],
        },
        pricingPlans: {
          create: [
            {
              planName: 'Free Tier',
              price: 0,
              billingCycle: 'MONTHLY',
              featuresList: ['GPT-3.5 access', 'Basic function calling', 'Community support'],
            },
            {
              planName: 'Pro',
              price: 20,
              billingCycle: 'MONTHLY',
              featuresList: ['GPT-4 access', 'DALL-E integration', 'Priority support', 'Advanced features'],
            },
          ],
        },
        editorialReviews: {
          create: {
            grade: 'A',
            verdict: 'Good MCP server with strong OpenAI integration and multi-modal capabilities.',
            reviewDate: new Date('2024-06-20'),
            badge: 'Solid Choice',
            notes: 'Great for OpenAI-powered applications.',
          },
        },
      },
    }),
  ]);

  // Create some sample reviews
  const users = await prisma.user.findMany();
  if (users.length > 0) {
    await prisma.mCPDirectoryReview.createMany({
      data: [
        {
          rating: 5,
          comment: 'Excellent MCP server with great Claude integration!',
          userId: users[0].id,
          mcpItemId: mcpItems[0].id,
        },
        {
          rating: 4,
          comment: 'Very useful tool for MCP development. The VS Code extension makes it easy to test servers.',
          userId: users[0].id,
          mcpItemId: mcpItems[1].id,
        },
        {
          rating: 4,
          comment: 'Good OpenAI integration with solid MCP support.',
          userId: users[0].id,
          mcpItemId: mcpItems[2].id,
        },
      ],
    });
  }

  // Create some sample discussions
  await prisma.mCPDirectoryDiscussion.createMany({
    data: [
      {
        title: 'Best practices for MCP server development',
        content: 'What are the best practices when developing MCP servers? I\'m looking for advice on error handling and performance optimization.',
        upvotes: 15,
        userId: users[0]?.id || '',
        mcpItemId: mcpItems[0].id,
      },
      {
        title: 'VSCode extension feature requests',
        content: 'I would love to see better debugging features in the VSCode extension. Any plans for enhanced protocol inspection?',
        upvotes: 8,
        userId: users[0]?.id || '',
        mcpItemId: mcpItems[1].id,
      },
    ],
  });

  // Create some sample FAQs
  await prisma.mCPDirectoryFAQ.createMany({
    data: [
      {
        question: 'What is MCP?',
        answer: 'MCP (Model Context Protocol) is a protocol that enables bidirectional communication between AI models and external tools, data sources, and custom capabilities.',
        mcpItemId: mcpItems[0].id,
      },
      {
        question: 'How do I get started with MCP?',
        answer: 'Start by installing an MCP server like the Anthropic or OpenAI server, then configure it in your application or development environment.',
        mcpItemId: mcpItems[0].id,
      },
      {
        question: 'What programming languages are supported?',
        answer: 'MCP supports multiple programming languages including TypeScript, Python, JavaScript, Rust, and Go.',
        mcpItemId: mcpItems[1].id,
      },
    ],
  });

  console.log('✅ MCP Directory Platform seeded successfully!');
  console.log(`📊 Created ${categories.length} categories, ${subcategories.length} subcategories, ${tags.length} tags, and ${mcpItems.length} MCP items`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });