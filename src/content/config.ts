import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title:       z.string(),
    description: z.string(),
    cover:       image(),
    images:      z.array(image()),
    order:       z.number(),
    liveUrl:     z.string().url().optional(),
    type:        z.string(),
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
