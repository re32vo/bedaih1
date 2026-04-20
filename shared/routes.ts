import { z } from "zod";
import {
  insertBeneficiarySchema,
  insertJobApplicationSchema,
  insertContactMessageSchema,
} from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  beneficiaries: {
    create: {
      method: "POST" as const,
      path: "/api/beneficiaries",
      input: insertBeneficiarySchema,
      responses: {
        201: z.custom<any>(),
        400: errorSchemas.validation,
      },
    },
  },
  jobs: {
    create: {
      method: "POST" as const,
      path: "/api/jobs/apply",
      input: insertJobApplicationSchema,
      responses: {
        201: z.custom<any>(),
        400: errorSchemas.validation,
      },
    },
  },
  contact: {
    create: {
      method: "POST" as const,
      path: "/api/contact",
      input: insertContactMessageSchema,
      responses: {
        201: z.custom<any>(),
        400: errorSchemas.validation,
      },
    },
  },
  volunteers: {
    create: {
      method: "POST" as const,
      path: "/api/volunteers",
      input: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(9),
        experience: z.string().min(10),
        opportunityTitle: z.string().optional(),
      }),
      responses: {
        201: z.custom<any>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
