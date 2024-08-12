import { z } from "zod";

const NonEmptyStringSchema = z.string().min(1);

export const EnvVarSchema = z.object({
  SUPERVISOR_TOKEN: NonEmptyStringSchema,
  ENTITIES: z.preprocess(
    (val) => {
      if (typeof val !== "string") return [];
      const json = JSON.parse(val);
      if (!Array.isArray(json)) return [json];
      return json;
    },
    z.array(
      z.object({
        ha_sensor_id: NonEmptyStringSchema,
        bueno_data_stream_id: NonEmptyStringSchema,
      }),
    ),
  ),
  BUENO_INTEGRATION_ID: NonEmptyStringSchema,
  BUENO_CREDENTIALS: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : {}),
    z.object({
      email: NonEmptyStringSchema,
      password: NonEmptyStringSchema,
    }),
  ),
  BUENO_API_URL: NonEmptyStringSchema,
});
