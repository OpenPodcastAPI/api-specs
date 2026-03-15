import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
<<<<<<< HEAD:astro.config.ts
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi'
=======
import AutoImport from "astro-auto-import";
import {
  remarkDefinitionList,
  defListHastHandlers,
} from "remark-definition-list";
import starlightOpenAPI, { openAPISidebarGroups } from "starlight-openapi";
>>>>>>> ef160ed (Add missing files):astro.config.mjs

export default defineConfig({
  integrations: [
    starlight({
      title: "Open Podcast API",
      favicon: "favicon.ico",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/OpenPodcastApi/api-specs",
        },
      ],
      plugins: [
        starlightOpenAPI([
          {
            base: "/explorer",
            schema: "./schema.yml",
<<<<<<< HEAD:astro.config.ts
	    sidebar: {
	      label: "API explorer",
	    }
          }
        ])
=======
          },
        ]),
>>>>>>> ef160ed (Add missing files):astro.config.mjs
      ],
      sidebar: [
        {
          label: "Project overview",
          link: "about",
        },
        {
          label: "Code of conduct",
          link: "coc",
        },
        {
          label: "Specifications",
<<<<<<< HEAD:astro.config.ts
          items: [
            {
              label: "Introduction",
              link: "specs",
            },
            {
              label: "Subscriptions",
              collapsed: true,
              items: [{
                autogenerate: {
                  directory: "specs/subscriptions",
                }
              }],
            },
          ],
        },
	...openAPISidebarGroups,
=======
          autogenerate: {
            directory: "specs",
          },
        },
        ...openAPISidebarGroups,
      ],
    }),
    AutoImport({
      imports: [
        {
          "@astrojs/starlight/components": [
            "Card",
            "CardGrid",
            "LinkCard",
            "Tabs",
            "TabItem",
          ],
        },
        "src/components/SponsorCallout.astro",
>>>>>>> ef160ed (Add missing files):astro.config.mjs
      ],
    }),
  ],
});
