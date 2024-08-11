import { z } from "zod";
import { isValidNumber, safeParseInt } from "./number";

/** Parses a number to a number, or a string to a valid, non-finite number */
export const IntegerSchema = z.preprocess(
  (val) =>
    typeof val === "number" && isValidNumber(val)
      ? val
      : typeof val === "string"
        ? safeParseInt(val)
        : undefined,
  z.number().optional(),
);
