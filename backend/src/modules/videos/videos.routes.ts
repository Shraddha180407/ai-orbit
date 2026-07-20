import { Hono } from "hono";
import { listVideos, getVideoBySlug, getRelatedVideos, getVideosCount } from "./videos.controller.js";

const videosRouter = new Hono();


videosRouter.get("/", listVideos);
videosRouter.get("/count", getVideosCount);
videosRouter.get("/:slug", getVideoBySlug);
videosRouter.get("/:slug/related", getRelatedVideos);

export { videosRouter };