import { defineCollection, z } from 'astro:content';

const guidesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('فريق بوابتي 360'),
    category: z.string().default('ecoles'),
    image: z.string().optional(),
  }),
});

export const collections = {
  'guides': guidesCollection,
};
