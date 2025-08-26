import type { Link, PhrasingContent, Root } from "mdast";
import { CONTINUE, SKIP, visit } from "unist-util-visit";

const TARGET_NODE_TYPES = ["text"];
const TARGET_STRING_REGEX = /ISO\s8601/g;
const LINK_URL = "https://www.iso.org/iso-8601-date-and-time-format.html";

export function remarkAutoLinkISO() {
   return function (tree: Root) {
      visit(tree, TARGET_NODE_TYPES, (node, index, parent) => {
         console.log(node);
         if (node.type !== "text" || !parent || typeof index !== "number") {
            return CONTINUE;
         }

         const value = node.value;
         const matches = [...value.matchAll(TARGET_STRING_REGEX)];
         if (matches.length === 0) return CONTINUE;

         const newNodes: PhrasingContent[] = [];
         let lastIndex = 0;

         for (const match of matches) {
            const matchStart = match.index!;
            const matchEnd = matchStart + match[0].length;

            if (matchStart > lastIndex) {
               newNodes.push({
                  type: "text",
                  value: value.slice(lastIndex, matchStart),
               });
            }

            newNodes.push({
               type: "link",
               url: LINK_URL,
               children: [
                  {
                     type: "text",
                     value: match[0],
                  },
               ],
            } as Link);

            lastIndex = matchEnd;
         }

         if (lastIndex < value.length) {
            newNodes.push({
               type: "text",
               value: value.slice(lastIndex),
            });
         }

         parent.children.splice(index, 1, ...newNodes);

         return SKIP;
      });
   };
}
