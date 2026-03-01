import type { SuggestionProps } from "@tiptap/suggestion";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { menu } from "styled-system/recipes";

import type { MentionItem } from "./itemMentionOptions";

const styles = menu({ size: "sm" });

export interface SuggestionListRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

export const SuggestionList = forwardRef<
  SuggestionListRef,
  SuggestionProps<MentionItem>
>(function SuggestionList(props, ref) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [props.items]);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  function selectItem(index: number) {
    const item = props.items[index];
    if (item) {
      props.command({
        id: item.id,
        categoryId: item.categoryId,
        label: item.label,
      });
    }
  }

  useImperativeHandle(ref, () => ({
    onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowUp") {
        setSelectedIndex((i) =>
          i === 0 ? Math.max(props.items.length - 1, 0) : i - 1,
        );
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((i) => (i === props.items.length - 1 ? 0 : i + 1));
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  return (
    <div
      className={styles.content}
      style={{ minWidth: "180px", maxHeight: "200px" }}
    >
      {props.items.length === 0 ? (
        <div
          className={styles.item}
          style={{ pointerEvents: "none", opacity: 0.5 }}
        >
          No items found
        </div>
      ) : (
        props.items.map((item, index) => (
          <button
            key={item.id}
            ref={index === selectedIndex ? selectedRef : null}
            onClick={() => selectItem(index)}
            data-highlighted={index === selectedIndex ? "" : undefined}
            className={styles.item}
          >
            {item.label}
          </button>
        ))
      )}
    </div>
  );
});
