import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import {
	remarkDefinitionList,
	defListHastHandlers,
} from "remark-definition-list";

// https://astro.build/config
export default defineConfig({
	integrations: [starlight({
		title: "Open Podcast API",
		favicon: "favicon.ico",
		social: {
			github: "https://github.com/OpenPodcastApi/api-specs"
		},
		sidebar: [{
			label: "Project overview",
			link: "overview"
		}, {
			label: "Specifications",
			items: [{ label: "Introduction", link: "specs" }, {
				label: "Subscriptions",
				collapsed: true,
				autogenerate: {
					directory: "specs/subscriptions"
				}
			}]
		},
		{
			label: "API explorer",
			link: "rapidoc.html"
		}]
	})],
	// Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
	image: {
		service: {
			entrypoint: "astro/assets/services/sharp"
		}
	},
	markdown: {
		remarkPlugins: [remarkDefinitionList],
		remarkRehype: {
			handlers: {
				...defListHastHandlers,
			},
		},
	}
});
