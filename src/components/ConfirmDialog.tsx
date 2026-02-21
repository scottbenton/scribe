import { type ReactNode } from "react";
import { Portal } from "@ark-ui/react/portal";
import { Button } from "@/components/ui";
import * as Dialog from "@/components/ui/dialog";
import { Box } from "styled-system/jsx";

interface ConfirmDialogBaseProps {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
}

// Uncontrolled variant — provide a trigger element
interface UncontrolledProps extends ConfirmDialogBaseProps {
  trigger: ReactNode;
  open?: never;
  onOpenChange?: never;
}

// Controlled variant — manage open state externally
interface ControlledProps extends ConfirmDialogBaseProps {
  trigger?: never;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ConfirmDialogProps = UncontrolledProps | ControlledProps;

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  destructive = false,
  ...rest
}: ConfirmDialogProps) {
  const isControlled = "open" in rest && rest.open !== undefined;

  return (
    <Dialog.Root
      open={isControlled ? rest.open : undefined}
      onOpenChange={
        isControlled ? ({ open }) => rest.onOpenChange(open) : undefined
      }
    >
      {!isControlled && rest.trigger && (
        <Dialog.Trigger asChild>{rest.trigger}</Dialog.Trigger>
      )}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
            {description && (
              <Dialog.Description>{description}</Dialog.Description>
            )}
          </Dialog.Header>
          <Dialog.Footer>
            <Box display="flex" gap={3} justifyContent="flex-end">
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{cancelLabel}</Button>
              </Dialog.ActionTrigger>
              <Dialog.ActionTrigger asChild>
                <Button
                  colorPalette={destructive ? "red" : undefined}
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </Button>
              </Dialog.ActionTrigger>
            </Box>
          </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
