import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateKeyBetween } from "fractional-indexing";
import { Portal } from "@ark-ui/react/portal";
import { Button, Input } from "@/components/ui";
import * as Dialog from "@/components/ui/dialog";
import * as Field from "@/components/ui/field";
import { useCreateRealmCategoryItem } from "@/hooks/useCreateRealmCategoryItem";
import { useRealmCategoryItems } from "@/hooks/useRealmCategoryItems";
import { Box } from "styled-system/jsx";

const schema = z.object({
  label: z.string().min(1, "Label is required"),
});

type FormValues = z.infer<typeof schema>;

interface CreateItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
}

export function CreateItemDialog({
  open,
  onOpenChange,
  categoryId,
}: CreateItemDialogProps) {
  const { items } = useRealmCategoryItems(categoryId);
  const { createItem, isLoading } = useCreateRealmCategoryItem(categoryId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function onSubmit(values: FormValues) {
    const maxOrder = items?.reduce<string | null>(
      (max, item) => (max === null || item.order > max ? item.order : max),
      null,
    );
    const order = generateKeyBetween(maxOrder, null);

    createItem(
      { label: values.label, order },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  }

  function handleOpenChange({ open }: { open: boolean }) {
    if (!open) reset();
    onOpenChange(open);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="xs">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Dialog.Title>New Item</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body py={5}>
                <Field.Root invalid={!!errors.label} width="full">
                  <Field.Label>Label</Field.Label>
                  <Input
                    {...register("label")}
                    autoFocus
                    placeholder="Item label"
                  />
                  {errors.label && (
                    <Field.ErrorText>{errors.label.message}</Field.ErrorText>
                  )}
                </Field.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Box display="flex" gap={3} justifyContent="flex-end">
                  <Dialog.ActionTrigger asChild>
                    <Button variant="subtle" type="button">
                      Cancel
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button type="submit" loading={isLoading}>
                    Create
                  </Button>
                </Box>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
