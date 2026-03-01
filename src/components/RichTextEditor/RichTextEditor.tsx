import { type JSONContent, generateText } from "@tiptap/core";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { Underline } from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useMemo, useRef } from "react";
import { css } from "styled-system/css";
import { Box } from "styled-system/jsx";

import { RealmCategoryItemsRepository } from "@/lib/repository/realm-category-items.repository";

import { useAuthStore } from "@/store/auth.store";

import { createItemMentionExtension } from "./ItemMentionExtension";
import { Toolbar } from "./Toolbar";

export interface RichTextEditorProps {
  itemId: string;
  initialContent: JSONContent | null;
  onSave: (content: JSONContent, text: string) => void;
  realmId: string;
}

const editorContentClass = css({
  flex: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  "&>div": {
    flexGrow: 1,
    display: "flex",
  },
  "& .ProseMirror": {
    pt: 4,
    px: 2,
    pb: 10,
    flexGrow: 1,
    outline: "none",
    minH: "200px",
    lineHeight: "1.7",
    color: "fg.default",
    "& > * + *": { mt: "0.75em" },
    "& h2": {
      fontSize: "2xl",
      fontWeight: "bold",
      lineHeight: "1.3",
      mt: "1.5em",
    },
    "& h3": {
      fontSize: "xl",
      fontWeight: "semibold",
      lineHeight: "1.3",
      mt: "1.25em",
    },
    "& h4": {
      fontSize: "lg",
      fontWeight: "semibold",
      lineHeight: "1.3",
      mt: "1.25em",
    },
    "& h5": { fontSize: "md", fontWeight: "semibold", mt: "1.25em" },
    "& h6": { fontSize: "sm", fontWeight: "semibold", mt: "1.25em" },
    "& blockquote": {
      borderLeft: "3px solid",
      borderColor: "border.subtle",
      pl: 4,
      ml: 0,
      color: "fg.muted",
      fontStyle: "italic",
    },
    "& ul": { listStyleType: "disc", pl: 6 },
    "& ol": { listStyleType: "decimal", pl: 6 },
    "& ul[data-type='taskList']": { listStyle: "none", pl: 0 },
    "& ul[data-type='taskList'] li": {
      display: "flex",
      alignItems: "baseline",
      gap: 2,
    },
    "& ul[data-type='taskList'] li > label": {
      flexShrink: 0,
      mt: "0.25em",
      cursor: "pointer",
    },
    "& ul[data-type='taskList'] li > div": { flex: 1 },
    "& a": {
      color: "colorPalette.solid.bg",
      textDecoration: "underline",
      cursor: "pointer",
      _hover: { opacity: 0.8 },
    },
    "& mark": {
      backgroundColor: "primary.subtle.bg.active",
      color: "fg.default",
      borderRadius: "sm",
      px: "0.5",
    },
    "& p.is-editor-empty:first-child::before": {
      content: "attr(data-placeholder)",
      color: "fg.subtle",
      float: "left",
      height: 0,
      pointerEvents: "none",
    },
  },
});

export function RichTextEditor({
  itemId,
  initialContent,
  onSave,
  realmId,
}: RichTextEditorProps) {
  const isDirty = useRef(false);
  const contentRef = useRef<JSONContent>({});
  const onSaveRef = useRef(onSave);
  // eslint-disable-next-line react-hooks/refs
  onSaveRef.current = onSave;

  const extensions = useMemo(() => {
    return [
      StarterKit.configure({
        heading: { levels: [2, 3, 4, 5, 6] },
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      createItemMentionExtension(realmId),
    ];
  }, [realmId]);

  const editor = useEditor({
    extensions,
    content: initialContent ?? undefined,
    onUpdate({ editor }) {
      isDirty.current = true;
      contentRef.current = editor.getJSON();
    },
  });

  // Autosave interval — every 10 seconds when dirty
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty.current) {
        onSaveRef.current(
          contentRef.current,
          generateText(contentRef.current, extensions),
        );
        isDirty.current = false;
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [extensions]);

  // Save on unmount (covers all in-app navigation including item→item due to key={itemId})
  useEffect(() => {
    return () => {
      if (isDirty.current) {
        onSaveRef.current(
          contentRef.current,
          generateText(contentRef.current, extensions),
        );
      }
    };
  }, [extensions]);

  // Save on browser unload / external navigation via keepalive fetch
  useEffect(() => {
    function handleBeforeUnload() {
      if (!isDirty.current) return;
      const token = useAuthStore.getState().token;
      if (token) {
        RealmCategoryItemsRepository.updateNotesTextBeacon(
          itemId,
          contentRef.current,
          generateText(contentRef.current, extensions),
          token,
        );
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [itemId, extensions]);

  if (!editor) return null;

  return (
    <Box
      className={css({
        display: "flex",
        flexDir: "column",
        flexGrow: 1,
        bg: "bg.default",
      })}
    >
      <Toolbar editor={editor} />
      <Box flexGrow={1} className={editorContentClass}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
