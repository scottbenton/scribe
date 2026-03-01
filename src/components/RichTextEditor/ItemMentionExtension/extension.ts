import { Mention } from "@tiptap/extension-mention";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ItemMentionView } from "./ItemMention";
import { createItemMentionOptions } from "./itemMentionOptions";

export function createItemMentionExtension(realmId: string) {
  return Mention.extend({
    name: "itemMention",

    addAttributes() {
      return {
        id: { default: null },
        label: { default: null },
        categoryId: { default: null },
      };
    },

    addStorage() {
      return { realmId: "" };
    },

    onCreate() {
      this.storage.realmId = (this.options as any).realmId ?? "";
    },

    addNodeView() {
      return ReactNodeViewRenderer(ItemMentionView);
    },

    parseHTML() {
      return [{ tag: 'span[data-type="item-mention"]' }];
    },

    renderHTML({ HTMLAttributes }) {
      return ["span", { "data-type": "item-mention", ...HTMLAttributes }, 0];
    },
  }).configure({
    HTMLAttributes: { class: "item-mention" },
    suggestion: createItemMentionOptions(realmId),
    realmId,
  } as any);
}
