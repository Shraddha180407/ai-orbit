import { Hono } from 'hono';
import { getPrisma } from '../../lib/prisma.js'; // Adjust relative path if needed to point to your lib/prisma file

export const pressModule = new Hono();

pressModule.get('/', async (c: any) => {
  try {
    const prisma = getPrisma(c.env); // Uses the worker environment bindings safely
    const releases = await prisma.pressRelease.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    return c.json({ success: true, data: releases });
  } catch (error) {
    console.error(error);
    return c.json({ success: false, error: 'Failed to fetch press releases' }, 500);
  }
});