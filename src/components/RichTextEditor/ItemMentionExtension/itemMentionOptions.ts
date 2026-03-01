import { ReactRenderer } from "@tiptap/react";
import type { SuggestionOptions } from "@tiptap/suggestion";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import { queryClient } from "@/context/AppProviders";
import { type IRealmCategory } from "@/types/realm-categories.type";
import { type IRealmCategoryItem } from "@/types/realm-category-items.type";
import { SuggestionList, type SuggestionListRef } from "./SuggestionList";

export interface MentionItem {
  id: string;
  categoryId: string;
  label: string;
}

export function createItemMentionOptions(
  realmId: string,
): Omit<SuggestionOptions<MentionItem>, "editor"> {
  return {
    char: "@",
    allowSpaces: true,
    startOfLine: false,

    items({ query }): MentionItem[] {
      const categories =
        queryClient.getQueryData<IRealmCategory[]>([
          "realm-categories",
          realmId,
        ]) ?? [];

      const allItems: MentionItem[] = categories.flatMap((cat) => {
        const items =
          queryClient.getQueryData<IRealmCategoryItem[]>([
            "realm-category-items",
            cat.id,
          ]) ?? [];
        return items.map((item) => ({
          id: item.id,
          categoryId: cat.id,
          label: item.label ?? "Untitled",
        }));
      });

      if (!query) return allItems.slice(0, 10);
      const lower = query.toLowerCase();
      return allItems
        .filter((item) => item.label.toLowerCase().includes(lower))
        .slice(0, 10);
    },

    render() {
      let renderer: ReactRenderer<SuggestionListRef>;
      let popup: TippyInstance;

      return {
        onStart(props) {
          renderer = new ReactRenderer(SuggestionList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) return;

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect as () => DOMRect,
            appendTo: () => document.body,
            content: renderer.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          })[0];
        },

        onUpdate(props) {
          renderer.updateProps(props);
          if (!props.clientRect || !popup) return;
          popup.setProps({
            getReferenceClientRect: props.clientRect as () => DOMRect,
          });
        },

        onKeyDown(props) {
          if (props.event.key === "Escape") {
            popup?.hide();
            return true;
          }
          return renderer.ref?.onKeyDown(props.event) ?? false;
        },

        onExit() {
          popup?.destroy();
          renderer?.destroy();
        },
      };
    },
  };
}
