import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import AutoImport from "astro-auto-import";
import {
  remarkDefinitionList,
  defListHastHandlers,
} from "remark-definition-list";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Open Podcast API",
      favicon: "favicon.ico",
      social: {
        github: "https://github.com/OpenPodcastApi/api-specs",
      },
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
              autogenerate: {
                directory: "specs/subscriptions",
              },
            },
          ],
        },
        {
          label: "API explorer",
          link: "rapidoc.html",
        },
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
      ],
    }),
  ],
  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  markdown: {
    remarkPlugins: [remarkDefinitionList],
    remarkRehype: {
      handlers: {
        ...defListHastHandlers,
      },
    },
  },
});
