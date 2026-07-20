import { Hono } from 'hono';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { getPrisma } from '../../lib/prisma.js';

export const userRouter = new Hono();

// We initialize the controller inside the route handlers to get access to context Prisma
userRouter.get('/saved-tools', (c) => {
  const prisma = getPrisma(c.env);
  const service = new UserService(prisma);
  const controller = new UserController(service);
  return controller.getSavedTools(c);
});

userRouter.delete('/saved-tools/:id', (c) => {
  const prisma = getPrisma(c.env);
  const service = new UserService(prisma);
  const controller = new UserController(service);
  return controller.removeSavedTool(c);
});

userRouter.get('/history', (c) => {
  const prisma = getPrisma(c.env);
  const service = new UserService(prisma);
  const controller = new UserController(service);
  return controller.getHistory(c);
});

userRouter.post('/history', (c) => {
  const prisma = getPrisma(c.env);
  const service = new UserService(prisma);
  const controller = new UserController(service);
  return controller.recordHistory(c);
});
