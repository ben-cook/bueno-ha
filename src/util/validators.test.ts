import { expect, test } from "vitest";
import { FloatSchema } from "./validators";

test("parses valid strings", () => {
  expect(FloatSchema.safeParse("-1").data).toBe(-1);
  expect(FloatSchema.safeParse("0").data).toBe(0);
  expect(FloatSchema.safeParse("1").data).toBe(1);
  expect(FloatSchema.safeParse("1.5").data).toBe(1.5);
});

test("parses invalid strings to undefined", () => {
  expect(FloatSchema.safeParse("").data).toBe(undefined);
  expect(FloatSchema.safeParse("a").data).toBe(undefined);
});

test("parses valid numbers", () => {
  expect(FloatSchema.safeParse(-1).data).toBe(-1);
  expect(FloatSchema.safeParse(0).data).toBe(0);
  expect(FloatSchema.safeParse(1).data).toBe(1);
  expect(FloatSchema.safeParse(1.5).data).toBe(1.5);
});

test("parses invalid numbers to undefined", () => {
  expect(FloatSchema.safeParse(NaN).data).toBe(undefined);
  expect(FloatSchema.safeParse(Infinity).data).toBe(undefined);
  expect(FloatSchema.safeParse(-Infinity).data).toBe(undefined);
});
