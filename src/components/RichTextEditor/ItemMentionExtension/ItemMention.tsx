import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { css } from "styled-system/css";
import { useLocation } from "wouter";

import { routes } from "@/routes/routes";

export function ItemMentionView(props: NodeViewProps) {
  const { node } = props;
  const [, navigate] = useLocation();

  const id = node.attrs.id as string;
  const label = node.attrs.label as string;
  const categoryId = node.attrs.categoryId as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const realmId = (props.editor.storage as Record<string, any>).itemMention
    ?.realmId as string | undefined;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    console.debug(realmId, categoryId, id);
    if (realmId && categoryId && id) {
      navigate(routes.item(realmId, categoryId, id));
    }
  }

  return (
    <NodeViewWrapper as="span" style={{ display: "inline" }}>
      <span
        onClick={handleClick}
        contentEditable={false}
        className={css({
          display: "inline-flex",
          alignItems: "center",
          px: "1.5",
          py: "0.5",
          borderRadius: "full",
          fontSize: "xs",
          fontWeight: "medium",
          bg: "colorPalette.subtle.bg",
          color: "colorPalette.subtle.fg",
          cursor: "pointer",
          userSelect: "none",
          _hover: { bg: "colorPalette.subtle.bg.hover" },
        })}
      >
        @{label}
      </span>
    </NodeViewWrapper>
  );
}
