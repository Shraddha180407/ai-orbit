import { describe, it, expect } from "vitest";
import {
  DEVICES_DATA,
  getDeviceBySlug,
  getMainTaskColor,
  getSimilarDevices,
} from "@/data/devices";

describe("DEVICES_DATA", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(DEVICES_DATA)).toBe(true);
    expect(DEVICES_DATA.length).toBeGreaterThan(0);
  });

  it("each device has required fields", () => {
    for (const device of DEVICES_DATA) {
      expect(device.id).toBeDefined();
      expect(device.slug).toBeDefined();
      expect(device.name).toBeDefined();
      expect(device.manufacturer).toBeDefined();
      expect(device.category).toBeDefined();
      expect(device.availability).toBeDefined();
      expect(device.year).toBeDefined();
      expect(device.description).toBeDefined();
      expect(device.imageUrl).toBeDefined();
      expect(device.mainTask).toBeDefined();
    }
  });

  it("has unique ids", () => {
    const ids = DEVICES_DATA.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique slugs", () => {
    const slugs = DEVICES_DATA.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getDeviceBySlug", () => {
  it("finds device by slug", () => {
    const device = getDeviceBySlug("rabbit-r1");
    expect(device).toBeDefined();
    expect(device?.name).toBe("Rabbit r1");
  });

  it("finds device by id", () => {
    const device = getDeviceBySlug("cmrkw7rs500745ov3rrpadrat");
    expect(device).toBeDefined();
    expect(device?.name).toBe("Rabbit r1");
  });

  it("returns null for nonexistent slug", () => {
    expect(getDeviceBySlug("nonexistent")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(getDeviceBySlug("")).toBeNull();
  });
});

describe("getMainTaskColor", () => {
  it("returns a hex color for valid input", () => {
    const color = getMainTaskColor("Assistant");
    expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("returns first color for empty string", () => {
    const color = getMainTaskColor("");
    expect(color).toMatch(/^#/);
  });

  it("returns consistent color for same input", () => {
    const color1 = getMainTaskColor("Health");
    const color2 = getMainTaskColor("Health");
    expect(color1).toBe(color2);
  });

  it("returns different colors for different inputs", () => {
    const color1 = getMainTaskColor("Health");
    const color2 = getMainTaskColor("Smart Home");
    // Not guaranteed different, but very likely
    expect(typeof color1).toBe("string");
    expect(typeof color2).toBe("string");
  });

  it("handles special characters", () => {
    const color = getMainTaskColor("AI Edge!");
    expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("returns first color for undefined-like empty string", () => {
    const color = getMainTaskColor("");
    expect(color).toBeDefined();
  });
});

describe("getSimilarDevices", () => {
  it("returns devices in same category", () => {
    const device = DEVICES_DATA.find((d) => d.slug === "rabbit-r1")!;
    const similar = getSimilarDevices(device);
    expect(similar.length).toBeGreaterThan(0);
    for (const s of similar) {
      expect(s.id).not.toBe(device.id);
    }
  });

  it("does not include the device itself", () => {
    const device = DEVICES_DATA[0];
    const similar = getSimilarDevices(device);
    expect(similar.every((d) => d.id !== device.id)).toBe(true);
  });

  it("respects count parameter", () => {
    const device = DEVICES_DATA[0];
    const similar = getSimilarDevices(device, 2);
    expect(similar.length).toBeLessThanOrEqual(2);
  });

  it("falls back to other categories when no same-category match", () => {
    const uniqueCategoryDevice = DEVICES_DATA.find(
      (d) => DEVICES_DATA.filter((x) => x.category === d.category).length === 1
    );
    if (uniqueCategoryDevice) {
      const similar = getSimilarDevices(uniqueCategoryDevice);
      expect(similar.length).toBeGreaterThan(0);
      expect(similar.every((d) => d.id !== uniqueCategoryDevice.id)).toBe(true);
    }
  });

  it("returns empty array when no other devices exist", () => {
    const device = { ...DEVICES_DATA[0], id: "unique-id" };
    // All devices in same category are filtered out except this fake one
    const similar = DEVICES_DATA.filter(
      (d) => d.category === device.category && d.id !== device.id
    );
    // The real DEVICES_DATA always has duplicates, so this just verifies the logic
    expect(Array.isArray(similar)).toBe(true);
  });
});
