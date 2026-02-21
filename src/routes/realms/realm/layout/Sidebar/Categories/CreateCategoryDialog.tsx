import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateKeyBetween } from "fractional-indexing";
import { Portal } from "@ark-ui/react/portal";
import { Button, Input } from "@/components/ui";
import * as Dialog from "@/components/ui/dialog";
import * as Field from "@/components/ui/field";
import { useCreateRealmCategory } from "@/hooks/useCreateRealmCategory";
import { useRealmId } from "../../../hooks/useRealmId";
import { useRealmCategories } from "@/hooks/useRealmCategories";
import { Box } from "styled-system/jsx";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FormValues = z.infer<typeof schema>;

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
}: CreateCategoryDialogProps) {
  const realmId = useRealmId();
  const { categories } = useRealmCategories(realmId);
  const { createCategory, isLoading } = useCreateRealmCategory(realmId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function onSubmit(values: FormValues) {
    const lastCategory = categories?.[categories.length - 1];
    const order = generateKeyBetween(lastCategory?.order ?? null, null);

    createCategory(
      { name: values.name, order },
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
                <Dialog.Title>New Category</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body py={5}>
                <Field.Root invalid={!!errors.name} width="full">
                  <Field.Label>Name</Field.Label>
                  <Input
                    {...register("name")}
                    autoFocus
                    placeholder="Category name"
                  />
                  {errors.name && (
                    <Field.ErrorText>{errors.name.message}</Field.ErrorText>
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
