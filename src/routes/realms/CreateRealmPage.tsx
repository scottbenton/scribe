import { Button, Field, Input, Text } from "@/components/ui";
import * as Card from "@/components/ui/card";
import { useCreateRealm } from "@/hooks/useCreateRealm";
import { routes } from "@/routes/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Box, Stack } from "styled-system/jsx";
import { useLocation } from "wouter";
import { z } from "zod/v4";

const createRealmSchema = z.object({
  name: z.string().min(1, "Realm name is required"),
});
type CreateRealmFormValues = z.infer<typeof createRealmSchema>;

export function CreateRealmPage() {
  const { createRealm, isError } = useCreateRealm();
  const [_, navigate] = useLocation();

  const form = useForm<CreateRealmFormValues>({
    resolver: zodResolver(createRealmSchema),
    defaultValues: { name: "" },
  });

  const handleSubmit = form.handleSubmit(({ name }) => {
    createRealm(name, {
      onSuccess: (realmId) => navigate(routes.realm(realmId)),
      onError: (e) => {
        form.setError("root", {
          message:
            e instanceof Error
              ? e.message
              : "Failed to create realm. Please try again.",
        });
      },
    });
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="100vh"
      px={4}
    >
      <Card.Root maxW="md" w="full">
        <Card.Header>
          <Card.Title>Create a realm</Card.Title>
          <Card.Description>
            Give your new realm a name to get started.
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Box as="form" onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Field.Root invalid={!!form.formState.errors.name}>
                <Field.Label>Realm name</Field.Label>
                <Input
                  {...form.register("name")}
                  placeholder="e.g. The Shattered Kingdoms"
                  autoFocus
                />
                {form.formState.errors.name && (
                  <Field.ErrorText>
                    {form.formState.errors.name.message}
                  </Field.ErrorText>
                )}
              </Field.Root>
              {(form.formState.errors.root || isError) && (
                <Text color="error" textStyle="sm">
                  {form.formState.errors.root?.message ??
                    "Failed to create realm. Please try again."}
                </Text>
              )}
              <Button
                type="submit"
                loading={form.formState.isSubmitting}
                loadingText="Creating realm..."
                w="full"
              >
                Create realm
              </Button>
            </Stack>
          </Box>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
