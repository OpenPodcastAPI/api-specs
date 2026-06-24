import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightOpenAPI, { createOpenAPISidebarGroup } from 'starlight-openapi'

const openApiSidebar = createOpenAPISidebarGroup()

// https://astro.build/config
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
            sidebar: { group: openApiSidebar }
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
        {
          label: 'Schema',
          collapsed: false,
          items: [openApiSidebar]
        }
      ],
    }),
  ],
  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  }
});
