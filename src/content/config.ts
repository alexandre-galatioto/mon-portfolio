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
    type:        z.string(),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({
    portrait:     z.string(),
    linkedinUrl:  z.string().url().optional(),
    instagramUrl: z.string().url().optional(),
  }),
});

export const collections = { projects, about };
