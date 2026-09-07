import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { docsLoader } from '@astrojs/starlight/loaders';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				apiClassification: z.enum([
					'core-endpoint',
					'optional-endpoint',
					'core-action',
					'optional-action',
				]).optional(),
			}),
		}),
	}),
	i18n: defineCollection({ type: 'data', schema: i18nSchema() }),
};
