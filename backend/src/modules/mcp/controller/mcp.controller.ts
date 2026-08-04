import { Context } from 'hono';
import { MCPService } from '../service/mcp.service.js';
import { 
  MCPItemQuerySchema, 
  MCPItemSlugSchema, 
  ReviewParamSchema, 
  ReviewBodySchema, 
  DiscussionParamSchema, 
  DiscussionBodySchema, 
  DiscussionReplyParamSchema, 
  DiscussionReplyBodySchema, 
  ClaimParamSchema, 
  ClaimBodySchema, 
  ReportParamSchema, 
  ReportBodySchema 
} from '../validator/index.js';
import { Hono } from 'hono';
import { jwtMiddleware } from '../../../middleware/jwt.js';
import { asyncHandler } from '../middleware/error.js';
import { MCPError } from '../middleware/error.js';
import type { ReviewResponseDTO, DiscussionResponseDTO } from '../types/index.js';

// Define types for Hono variables
export type Variables = {
  mcpService: MCPService;
};

export class MCPController {
  // No longer storing service as instance variable - retrieved from context per request

  listMCPItems = asyncHandler(async (c: Context) => {
    const service = c.get('mcpService');
    const query = MCPItemQuerySchema.parse(c.req.query());
    const result = await service.getMCPItems({
      ...query,
      page: parseInt(query.page),
      limit: parseInt(query.limit),
    });

    return c.json({
      success: true,
      data: result,
    });
  });

  getMCPItemBySlug = asyncHandler(async (c: Context) => {
    const service = c.get('mcpService');
    const { slug } = MCPItemSlugSchema.parse(c.req.param());
    const item = await service.getMCPItemBySlug(slug);

    if (!item) {
      throw new MCPError('MCP item not found', 'NOT_FOUND', 404);
    }

    return c.json({
      success: true,
      data: item,
    });
  });

  getMCPItemAlternatives = asyncHandler(async (c: Context) => {
    const service = c.get('mcpService');
    const { slug } = MCPItemSlugSchema.parse(c.req.param());
    const alternatives = await service.getMCPItemAlternatives(slug);

    return c.json({
      success: true,
      data: alternatives,
    });
  });

  toggleUpvote = asyncHandler(async (c: Context) => {
    const service = c.get('mcpService');
    const { slug } = MCPItemSlugSchema.parse(c.req.param());
    const userId = c.get('userId'); // From JWT middleware
    
    if (!userId) {
      throw new MCPError('Authentication required', 'UNAUTHORIZED', 401);
    }

    const result = await service.toggleUpvote(slug, userId);

    return c.json({
      success: true,
      data: result,
    });
  });

  toggleSave = asyncHandler(async (c: Context) => {
    const service = c.get('mcpService');
    const { slug } = MCPItemSlugSchema.parse(c.req.param());
    const userId = c.get('userId'); // From JWT middleware
    
    if (!userId) {
      throw new MCPError('Authentication required', 'UNAUTHORIZED', 401);
    }

    const result = await service.toggleSave(slug, userId);

    return c.json({
      success: true,
      data: result,
    });
  });

  incrementViews = asyncHandler(async (c: Context) => {
    const service = c.get('mcpService');
    const { slug } = MCPItemSlugSchema.parse(c.req.param());
    
    const item = await service.getMCPItemBySlug(slug);
    if (!item) {
      throw new MCPError('MCP item not found', 'NOT_FOUND', 404);
    }
    // Note: In production, you might want to rate limit this endpoint
    await service.incrementViews(slug);

    return c.json({
      success: true,
      message: 'View count incremented',
    });
  });

  submitReview = asyncHandler(async (c: Context) => {
    const service = c.get('mcpService');
    const { slug } = ReviewParamSchema.parse(c.req.param());
    const userId = c.get('userId'); // From JWT middleware
    
    if (!userId) {
      throw new MCPError('Authentication required', 'UNAUTHORIZED', 401);
    }

    const body = await c.req.json();
    const { rating, comment } = ReviewBodySchema.parse(body);

    const review = await service.submitReview(slug, userId, rating, comment);

    return c.json({
      success: true,
      data: review,
    });
  });

  getReviews = asyncHandler(async (c: Context) => {
    const service = c.get('mcpService');
    const { slug } = MCPItemSlugSchema.parse(c.req.param());
    const query = {
      page: parseInt(c.req.query('page') || '1'),
      limit: parseInt(c.req.query('limit') || '20'),
    };
    const result: ReviewResponseDTO = await service.getReviews(slug, query.page, query.limit);

    return c.json({
      success: true,
      data: result,
    });
  });

  getDiscussions = asyncHandler(async (c: Context) => {
    const service = c.get('mcpService');
    const { slug } = MCPItemSlugSchema.parse(c.req.param());
    const query = {
      page: parseInt(c.req.query('page') || '1'),
      limit: parseInt(c.req.query('limit') || '20'),
    };
    const result: DiscussionResponseDTO = await service.getDiscussions(slug, query.page, query.limit);

    return c.json({
      success: true,
      data: result,
    });
  });

  submitDiscussion = asyncHandler(async (c: Context) => {
    const service = c.get('mcpService');
    const { slug } = DiscussionParamSchema.parse(c.req.param());
    const userId = c.get('userId'); // From JWT middleware
    
    if (!userId) {
      throw new MCPError('Authentication required', 'UNAUTHORIZED', 401);
    }

    const body = await c.req.json();
    const { title, content } = DiscussionBodySchema.parse(body);

    const discussion = await service.submitDiscussion(slug, userId, title, content);

    return c.json({
      success: true,
      data: discussion,
    });
  });

  submitDiscussionReply = asyncHandler(async (c: Context) => {
    const service = c.get('mcpService');
    const { discussionId } = DiscussionReplyParamSchema.parse(c.req.param());
    const { content } = DiscussionReplyBodySchema.parse(await c.req.json());
    const userId = c.get('userId'); // From JWT middleware
    
    if (!userId) {
      throw new MCPError('Authentication required', 'UNAUTHORIZED', 401);
    }

    const reply = await service.submitDiscussionReply(discussionId, userId, content);

    return c.json({
      success: true,
      data: reply,
    });
  });

  submitClaim = asyncHandler(async (c: Context) => {
    const service = c.get('mcpService');
    const { slug } = ClaimParamSchema.parse(c.req.param());
    const body = await c.req.json();
    const claimData = ClaimBodySchema.parse(body);

    const claim = await service.submitClaim(slug, claimData);

    return c.json({
      success: true,
      data: claim,
    });
  });

  submitReport = asyncHandler(async (c: Context) => {
    const service = c.get('mcpService');
    const { slug } = ReportParamSchema.parse(c.req.param());
    const userId = c.get('userId'); // From JWT middleware
    
    if (!userId) {
      throw new MCPError('Authentication required', 'UNAUTHORIZED', 401);
    }

    const body = await c.req.json();
    const { reason, description } = ReportBodySchema.parse(body);

    const report = await service.submitReport(slug, userId, reason, description);

    return c.json({
      success: true,
      data: report,
    });
  });

  listMCPSubCategories = asyncHandler(async (c: Context) => {
    const service = c.get('mcpService');
    const subCategories = await service.listMCPSubCategories();
    return c.json(subCategories);
  });
}

// Create router
export const createMCPRouter = () => {
  const controller = new MCPController();
  const router = new Hono<{ Variables: Variables }>();

  // Public routes
  router.get('/subcategories', controller.listMCPSubCategories);
  router.get('/', controller.listMCPItems);
  router.get('/:slug', controller.getMCPItemBySlug);
  router.get('/:slug/alternatives', controller.getMCPItemAlternatives);
  router.get('/:slug/reviews', controller.getReviews);
  router.get('/:slug/discussions', controller.getDiscussions);
  router.post('/:slug/views', controller.incrementViews);

  // Authenticated routes
  router.use('*', jwtMiddleware);
  router.post('/:slug/upvote', controller.toggleUpvote);
  router.post('/:slug/save', controller.toggleSave);
  router.post('/:slug/reviews', controller.submitReview);
  router.post('/:slug/discussions', controller.submitDiscussion);
  router.post('/:slug/claim', controller.submitClaim);
  router.post('/:slug/report', controller.submitReport);

  // Discussion replies (separate route)
  router.post('/discussions/:discussionId/replies', jwtMiddleware, controller.submitDiscussionReply);

  return router;
};