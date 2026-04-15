import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    cover:       z.string(),
    images:      z.array(z.string()),
    order:       z.number(),
    liveUrl:     z.string().url().optional(),
    featured:    z.boolean().default(false),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({}),
});

export const collections = { projects, about };
