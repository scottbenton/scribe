import { useRef, useState } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import { createListCollection } from "@ark-ui/react/select";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Link,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  AtSign,
} from "lucide-react";
import { IconButton, Input } from "@/components/ui";
import * as Select from "@/components/ui/select";
import * as Popover from "@/components/ui/popover";
import { Box } from "styled-system/jsx";
import { css } from "styled-system/css";

const HEADING_OPTIONS = [
  { label: "Paragraph", value: "0" },
  { label: "H1", value: "2" },
  { label: "H2", value: "3" },
  { label: "H3", value: "4" },
  { label: "H4", value: "5" },
  { label: "H5", value: "6" },
] as const;

const headingCollection = createListCollection({
  items: HEADING_OPTIONS,
  itemToValue: (item) => item.value,
  itemToString: (item) => item.label,
});

interface ToolbarProps {
  editor: Editor;
}

function Divider() {
  return (
    <Box
      className={css({
        w: "1px",
        h: 5,
        bg: "border.subtle",
        mx: 0.5,
        flexShrink: 0,
      })}
    />
  );
}

function activeClass(active: boolean) {
  return css({
    color: active ? "colorPalette.solid.bg" : "fg.muted",
    bg: active ? "colorPalette.subtle.bg" : "transparent",
  });
}

export function Toolbar({ editor }: ToolbarProps) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);

  const {
    headingLevel,
    isBold,
    isItalic,
    isUnderline,
    isStrike,
    isBulletList,
    isOrderedList,
    isTaskList,
    isBlockquote,
    isHighlight,
    isLink,
  } = useEditorState({
    editor,
    selector: (ctx) => {
      const e = ctx.editor;
      let headingLevel = "0";
      for (let level = 2; level <= 6; level++) {
        if (e.isActive("heading", { level })) {
          headingLevel = String(level);
          break;
        }
      }
      return {
        headingLevel,
        isBold: e.isActive("bold"),
        isItalic: e.isActive("italic"),
        isUnderline: e.isActive("underline"),
        isStrike: e.isActive("strike"),
        isBulletList: e.isActive("bulletList"),
        isOrderedList: e.isActive("orderedList"),
        isTaskList: e.isActive("taskList"),
        isBlockquote: e.isActive("blockquote"),
        isHighlight: e.isActive("highlight"),
        isLink: e.isActive("link"),
      };
    },
  });

  function handleHeadingChange(value: string) {
    if (value === "0") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: Number(value) as 2 | 3 | 4 | 5 | 6 })
        .run();
    }
  }

  function handleLinkOpen() {
    const attrs = editor.getAttributes("link");
    setLinkUrl(attrs.href ?? "");
    setLinkOpen(true);
    setTimeout(() => linkInputRef.current?.focus(), 0);
  }

  function handleLinkApply() {
    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .setLink({ href: url, target: "_blank", rel: "noopener noreferrer" })
        .run();
    }
    setLinkOpen(false);
    setLinkUrl("");
  }

  return (
    <Box
      className={css({
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.5,
        bg: "gray.3",
        mx: -6,
        px: 8,
        py: 2,
        position: "sticky",
        top: 0,
        zIndex: 10,
      })}
    >
      {/* Heading select */}
      <Select.Root
        size="sm"
        collection={headingCollection}
        value={[headingLevel]}
        onValueChange={(details) => handleHeadingChange(details.value[0])}
        positioning={{ sameWidth: false, placement: "bottom-start" }}
        width="12ch"
      >
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
            <Select.Indicator />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            {HEADING_OPTIONS.map((opt) => (
              <Select.Item key={opt.value} item={opt}>
                <Select.ItemText>{opt.label}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>

      <Divider />

      {/* Text formatting */}
      <IconButton
        variant="plain"
        size="sm"
        aria-label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={activeClass(isBold)}
      >
        <Bold />
      </IconButton>
      <IconButton
        variant="plain"
        size="sm"
        aria-label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={activeClass(isItalic)}
      >
        <Italic />
      </IconButton>
      <IconButton
        variant="plain"
        size="sm"
        aria-label="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={activeClass(isUnderline)}
      >
        <Underline />
      </IconButton>
      <IconButton
        variant="plain"
        size="sm"
        aria-label="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={activeClass(isStrike)}
      >
        <Strikethrough />
      </IconButton>

      <Divider />

      {/* Lists */}
      <IconButton
        variant="plain"
        size="sm"
        aria-label="Bullet list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={activeClass(isBulletList)}
      >
        <List />
      </IconButton>
      <IconButton
        variant="plain"
        size="sm"
        aria-label="Ordered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={activeClass(isOrderedList)}
      >
        <ListOrdered />
      </IconButton>
      <IconButton
        variant="plain"
        size="sm"
        aria-label="Task list"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={activeClass(isTaskList)}
      >
        <ListChecks />
      </IconButton>

      <Divider />

      {/* Blockquote + Highlight */}
      <IconButton
        variant="plain"
        size="sm"
        aria-label="Blockquote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={activeClass(isBlockquote)}
      >
        <Quote />
      </IconButton>
      <IconButton
        variant="plain"
        size="sm"
        aria-label="Highlight"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={activeClass(isHighlight)}
      >
        <Highlighter />
      </IconButton>

      <Divider />

      {/* Link */}
      <Popover.Root
        open={linkOpen}
        onOpenChange={(d) => {
          setLinkOpen(d.open);
          if (!d.open) setLinkUrl("");
        }}
      >
        <Popover.Trigger asChild>
          <IconButton
            variant="plain"
            size="sm"
            aria-label="Link"
            onClick={handleLinkOpen}
            className={activeClass(isLink)}
          >
            <Link />
          </IconButton>
        </Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content>
            <Box display="flex" gap={2} p={2}>
              <Input
                ref={linkInputRef}
                size="sm"
                placeholder="https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLinkApply();
                  if (e.key === "Escape") setLinkOpen(false);
                }}
              />
              <button
                onClick={handleLinkApply}
                className={css({
                  px: 3,
                  borderRadius: "l1",
                  fontSize: "sm",
                  cursor: "pointer",
                  border: "none",
                  bg: "colorPalette.solid.bg",
                  color: "colorPalette.solid.fg",
                  flexShrink: 0,
                  _hover: { opacity: 0.9 },
                })}
              >
                Apply
              </button>
            </Box>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>

      {/* Mention */}
      <IconButton
        variant="plain"
        size="sm"
        aria-label="Mention item"
        onClick={() => editor.chain().focus().insertContent("@").run()}
        className={activeClass(false)}
      >
        <AtSign />
      </IconButton>
    </Box>
  );
}
