import { describe, it, expect } from "vitest";
import { NextResponse } from "next/server";
import { badRequest, unauthorized, notFound, internalError } from "@/lib/api-utils";

describe("api-utils", () => {
  describe("badRequest", () => {
    it("returns 400 status", () => {
      const res = badRequest("Invalid input");
      expect(res.status).toBe(400);
    });

    it("returns error message in body", async () => {
      const res = badRequest("Invalid input");
      const body = await res.json();
      expect(body).toEqual({ error: "Invalid input" });
    });
  });

  describe("unauthorized", () => {
    it("returns 401 status with default message", () => {
      const res = unauthorized();
      expect(res.status).toBe(401);
    });

    it("returns default 'Unauthorized' message", async () => {
      const res = unauthorized();
      const body = await res.json();
      expect(body).toEqual({ error: "Unauthorized" });
    });

    it("returns custom message", async () => {
      const res = unauthorized("Custom auth error");
      const body = await res.json();
      expect(body).toEqual({ error: "Custom auth error" });
    });
  });

  describe("notFound", () => {
    it("returns 404 status with default message", () => {
      const res = notFound();
      expect(res.status).toBe(404);
    });

    it("returns default 'Not found' message", async () => {
      const res = notFound();
      const body = await res.json();
      expect(body).toEqual({ error: "Not found" });
    });

    it("returns custom message", async () => {
      const res = notFound("Resource missing");
      const body = await res.json();
      expect(body).toEqual({ error: "Resource missing" });
    });
  });

  describe("internalError", () => {
    it("returns 500 status with default message", () => {
      const res = internalError();
      expect(res.status).toBe(500);
    });

    it("returns default 'Internal server error' message", async () => {
      const res = internalError();
      const body = await res.json();
      expect(body).toEqual({ error: "Internal server error" });
    });

    it("returns custom message", async () => {
      const res = internalError("Something broke");
      const body = await res.json();
      expect(body).toEqual({ error: "Something broke" });
    });
  });
});
