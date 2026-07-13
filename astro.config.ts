import { defineConfig } from "astro/config";
import { satteri } from '@astrojs/markdown-satteri';
import starlight from "@astrojs/starlight";
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi'

export default defineConfig({
  markdown: {
    processor: satteri({
      features: {
	gfm: true,
	headingAttributes: true,
	directive: true,
      },
    })
  },
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
	      label: "Conventions",
	      link: "specs/conventions"
	    },
	    {
	      label: "Authentication",
	      link: "specs/authentication"
	    },
	    {
	      label: "Synchronization",
	      link: "specs/sync",
	      badge: {
		text: "Core",
		variant: "success"
	      }
	    },
            {
              label: "Subscriptions",
              link: "specs/subscriptions",
	      badge: {
		text: 'Core',
		variant: 'success'
	      }
            },
          ],
        },
	...openAPISidebarGroups,
      ],
    }),
  ],
});
