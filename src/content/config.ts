import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title:       z.string(),
    description: z.string(),
    images:      z.array(image()),
    order:       z.number(),
    liveUrl:     z.string().url().optional(),
    type:        z.string(),
    navWhite:    z.number().min(0).max(1).default(0),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    portrait:     image(),
    linkedinUrl:  z.string().url().optional(),
    instagramUrl: z.string().url().optional(),
  }),
});

export const collections = { projects, about };
