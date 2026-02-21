# Drag and Drop

## Library

**dnd kit** (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`) — installed

Order keys are maintained with **fractional-indexing** — also installed.

## Structure

### Categories (Parent Nodes)
- Sortable among themselves
- Cannot be nested inside other categories
- Items cannot move between categories

### Items (within a category)
- Sortable within their category
- By default, flat drag-and-drop list
- Configurable to support nested/tree structure (not yet implemented)

## Not yet implemented

- Nested item tree structure — dnd kit's Sortable Tree example is the intended starting point when this is needed
