import { Hono } from 'hono';
import { adminMiddleware } from '../../middleware/jwt.js';
import { AdminController } from './admin.controller.js';

export const adminRouter = new Hono();
const adminController = new AdminController();

// All admin routes are protected
adminRouter.use('*', adminMiddleware);

// Analytics
adminRouter.get('/analytics', (c) => adminController.getAnalytics(c));

// Users Management
adminRouter.post('/users/invite', (c) => adminController.inviteAdmin(c));
adminRouter.get('/users', (c) => adminController.getUsers(c));
adminRouter.patch('/users/:id/role', (c) => adminController.updateUserRole(c));
adminRouter.patch('/users/:id/status', (c) => adminController.updateUserStatus(c));

// Reports Management
adminRouter.get('/reports', (c) => adminController.getReports(c));
adminRouter.patch('/reports/:id', (c) => adminController.updateReport(c));

// Content Management - Collections
adminRouter.get('/collections', (c) => adminController.getCollections(c));
adminRouter.post('/collections', (c) => adminController.createCollection(c));
adminRouter.patch('/collections/:id', (c) => adminController.updateCollection(c));
adminRouter.delete('/collections/:id', (c) => adminController.deleteCollection(c));

// Basic CRUD stubs for other entities
adminRouter.get('/tools', (c) => adminController.getTools(c));
adminRouter.post('/tools', (c) => adminController.createTool(c));
adminRouter.patch('/tools/:id', (c) => adminController.updateTool(c));
adminRouter.delete('/tools/:id', (c) => adminController.deleteTool(c));

adminRouter.get('/news', (c) => adminController.getNews(c));
adminRouter.delete('/news/:id', (c) => adminController.deleteNews(c));

adminRouter.post('/news', (c) => adminController.createNews(c));
adminRouter.patch('/news/:id', (c) => adminController.updateNews(c));

adminRouter.get('/companies', (c) => adminController.getCompanies(c));
adminRouter.post('/companies', (c) => adminController.createCompany(c));
adminRouter.patch('/companies/:id', (c) => adminController.updateCompany(c));
adminRouter.delete('/companies/:id', (c) => adminController.deleteCompany(c));

adminRouter.get('/models', (c) => adminController.getModels(c));
adminRouter.post('/models', (c) => adminController.createModel(c));
adminRouter.patch('/models/:id', (c) => adminController.updateModel(c));
adminRouter.delete('/models/:id', (c) => adminController.deleteModel(c));

adminRouter.get('/videos', (c) => adminController.getVideos(c));
adminRouter.post('/videos', (c) => adminController.createVideo(c));
adminRouter.patch('/videos/:id', (c) => adminController.updateVideo(c));
adminRouter.delete('/videos/:id', (c) => adminController.deleteVideo(c));
