import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guidesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('فريق بوابتي 360'),
    category: z.string().default('ecoles'),
    image: z.string().optional(),
  }),
});

export const collections = { guides: guidesCollection };
 
