import { z } from 'zod';
import { insertPlayerSchema, insertTransactionSchema, players, transactions } from './schema';

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
  players: {
    list: {
      method: 'GET' as const,
      path: '/api/players',
      responses: {
        200: z.array(z.custom<typeof players.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/players/:id',
      responses: {
        200: z.custom<typeof players.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/players',
      input: insertPlayerSchema,
      responses: {
        201: z.custom<typeof players.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/players/:id',
      input: insertPlayerSchema.partial(),
      responses: {
        200: z.custom<typeof players.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    reset: {
      method: 'POST' as const,
      path: '/api/game/reset',
      input: z.object({ startBalance: z.number().default(1500) }),
      responses: {
        200: z.array(z.custom<typeof players.$inferSelect>()),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/players/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  transactions: {
    list: {
      method: 'GET' as const,
      path: '/api/transactions',
      responses: {
        200: z.array(z.custom<typeof transactions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/transactions',
      // We use a custom schema here because from/to can be null (Bank)
      input: z.object({
        fromPlayerId: z.number().nullable().optional(),
        toPlayerId: z.number().nullable().optional(),
        amount: z.number().min(1),
        description: z.string(),
      }),
      responses: {
        201: z.custom<typeof transactions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
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
