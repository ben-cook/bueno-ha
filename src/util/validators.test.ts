import { expect, test } from "vitest";
import { IntegerSchema } from "./validators";

test("parses valid strings", () => {
  expect(IntegerSchema.safeParse("-1").data).toBe(-1);
  expect(IntegerSchema.safeParse("0").data).toBe(0);
  expect(IntegerSchema.safeParse("1").data).toBe(1);
});

test("parses invalid strings to undefined", () => {
  expect(IntegerSchema.safeParse("").data).toBe(undefined);
  expect(IntegerSchema.safeParse("a").data).toBe(undefined);
});

test("parses valid numbers", () => {
  expect(IntegerSchema.safeParse(-1).data).toBe(-1);
  expect(IntegerSchema.safeParse(0).data).toBe(0);
  expect(IntegerSchema.safeParse(1).data).toBe(1);
});

test("parses invalid numbers to undefined", () => {
  expect(IntegerSchema.safeParse(NaN).data).toBe(undefined);
  expect(IntegerSchema.safeParse(Infinity).data).toBe(undefined);
  expect(IntegerSchema.safeParse(-Infinity).data).toBe(undefined);
});
