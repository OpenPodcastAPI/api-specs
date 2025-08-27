import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import {
  defListHastHandlers,
  remarkDefinitionList,
} from "remark-definition-list";
import starlightOpenAPI, { openAPISidebarGroups } from "starlight-openapi";
import starlightSidebarTopics from "starlight-sidebar-topics";
import mermaid from "astro-mermaid";
import { remarkAutoLinkISO } from "./plugins/remark-autolink-iso";

export default defineConfig({
  integrations: [
    mermaid(),
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
            base: "/reference/api",
            label: "API reference",
            schema: "./schema.yml",
          },
        ]),
        starlightSidebarTopics([
          {
            label: "Project overview",
            link: "/docs/about",
            icon: "open-book",
            items: [{
              label: "Overview",
              collapsed: false,
              items: ["docs/about", "docs/coc", "docs/conventions"],
            }],
          },
          {
            label: "Specifications",
            link: "/specs",
            icon: "document",
            items: [
              {
                label: "Overview",
                collapsed: false,
                items: [
                  "specs",
                  "specs/headers",
                  "specs/pagination",
                  "specs/error-codes",
                ],
              },
              {
                label: "Subscriptions",
                collapsed: true,
                autogenerate: { directory: "specs/subscriptions" },
              },
              {
                label: "Operations",
                collapsed: true,
                autogenerate: { directory: "specs/operations" },
              },
              {
                label: "Extensions",
                collapsed: true,
                autogenerate: { directory: "specs/extensions" },
              },
              {
                label: "Profiles",
                collapsed: true,
                autogenerate: { directory: "specs/profiles" },
              },
            ],
          },
          {
            label: "Reference",
            link: "/reference",
            id: "reference",
            icon: "laptop",
            items: ["reference", ...openAPISidebarGroups],
          },
        ], {
          topics: {
            reference: ["/reference/api", "/reference/api/**/*"],
          },
        }),
      ],
    }),
  ],
  markdown: {
    remarkPlugins: [remarkDefinitionList, remarkAutoLinkISO],
    remarkRehype: {
      handlers: {
        ...defListHastHandlers,
      },
    },
  },
});
