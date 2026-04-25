import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi'

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
	    sidebar: {
	      label: "API explorer",
	    }
          }
        ])
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
      ],
    }),
  ],
});
