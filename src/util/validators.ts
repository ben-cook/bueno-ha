import { z } from "zod";
import { isValidNumber, safeParseFloat } from "./number";

/** Parses a number to a number, or a string to a valid, non-finite number */
export const FloatSchema = z.preprocess(
  (val) =>
    typeof val === "number" && isValidNumber(val)
      ? val
      : typeof val === "string"
        ? safeParseFloat(val)
        : undefined,
  z.number().optional(),
);
