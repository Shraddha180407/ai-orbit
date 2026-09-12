import { Hono } from 'hono';

const pressRouter = new Hono();

pressRouter.get('/', async (c) => {
  try {
    // If you want to use Prisma later, you can do:
    // const prisma = getPrisma(c.env);
    // const pressReleases = await prisma.press.findMany();

    // For now, safe mock data prevents any 500 crashes:
    const pressReleases = [
      {
        id: "1",
        date: "2026-06-15",
        tag: "Launch",
        title: "AI Orbit Launches Ecosystem Discovery Platform",
        description: "AI Orbit brings the rapidly evolving world of AI tools, agents, and models into a single interactive directory."
      }
    ];

    return c.json({
      success: true,
      data: pressReleases
    });
  } catch (err: any) {
    console.error("Press API Error:", err);
    return c.json({
      success: false,
      data: [],
      error: err.message || "Internal Server Error"
    }, 500);
  }
});

export default pressRouter;