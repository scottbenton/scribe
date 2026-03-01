import { Mention } from "@tiptap/extension-mention";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { ItemMentionView } from "./ItemMention";
import { createItemMentionOptions } from "./itemMentionOptions";

interface ItemMentionStorage {
  realmId: string;
}

// This extends the Storage interface, enabling `editor.storage.customExtension` to be of type `CustomExtensionStorage`
declare module "@tiptap/core" {
  interface Storage {
    itemMention: ItemMentionStorage;
  }
}
export function createItemMentionExtension(realmId: string) {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  return Mention.extend<{}, ItemMentionStorage>({
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
      this.storage.realmId =
        (this.options as unknown as { realmId: string | undefined }).realmId ??
        "";
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
  });
}
