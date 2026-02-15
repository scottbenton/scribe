import { Button, Field, Input, PinInput, Text, Heading } from "@/components/ui";
import { useAuthStore } from "@/store/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Box, Stack } from "styled-system/jsx";
import { z } from "zod/v4";

const emailSchema = z.object({
  email: z.email("Please enter a valid email address"),
});
type EmailFormValues = z.infer<typeof emailSchema>;

const otpSchema = z.object({
  otp: z.string().length(6, "Code must be 6 digits"),
});
type OtpFormValues = z.infer<typeof otpSchema>;

const OTP_LENGTH = 6;

export function AuthPage() {
  const sendOTPCodeToEmail = useAuthStore((store) => store.sendOTPCodeToEmail);
  const verifyOTPCode = useAuthStore((store) => store.verifyOTPCode);

  const [step, setStep] = useState<"email" | "otp">("email");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const handleEmailSubmit = emailForm.handleSubmit(async ({ email }) => {
    try {
      await sendOTPCodeToEmail(email);
      setSubmittedEmail(email);
      setStep("otp");
    } catch (e) {
      emailForm.setError("root", {
        message:
          e instanceof Error
            ? e.message
            : "Failed to send code. Please try again.",
      });
    }
  });

  const handleOtpSubmit = otpForm.handleSubmit(async ({ otp }) => {
    try {
      await verifyOTPCode(submittedEmail, otp);
    } catch (e) {
      otpForm.setError("root", {
        message:
          e instanceof Error ? e.message : "Invalid code. Please try again.",
      });
    }
  });

  const handleBack = () => {
    setStep("email");
    otpForm.reset();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      maxW="md"
      w="full"
      mx="auto"
      py={{ base: 6, sm: 8, md: 10 }}
      px={4}
    >
      <Box w={16} h={16}>
        <img src="/logo.webp" alt="Realm Tome Logo" />
      </Box>
      <Heading textStyle="2xl" mt={4}>
        Realm Tome
      </Heading>
      <Text textStyle="xl" color="fg.muted">
        Your worldbuilding companion
      </Text>

      {step === "email" ? (
        <Box as="form" onSubmit={handleEmailSubmit} w="full" mt={8}>
          <Stack gap={4}>
            <Heading textStyle="lg" color="fg.muted" textAlign="center">
              Sign up or login to get started
            </Heading>
            <Field.Root invalid={!!emailForm.formState.errors.email}>
              <Field.Label>Email address</Field.Label>
              <Input
                {...emailForm.register("email")}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
              {emailForm.formState.errors.email && (
                <Field.ErrorText>
                  {emailForm.formState.errors.email.message}
                </Field.ErrorText>
              )}
            </Field.Root>
            {emailForm.formState.errors.root && (
              <Text color="error" textStyle="sm">
                {emailForm.formState.errors.root.message}
              </Text>
            )}
            <Button
              type="submit"
              loading={emailForm.formState.isSubmitting}
              loadingText="Sending code..."
              w="full"
            >
              Send login code
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box as="form" onSubmit={handleOtpSubmit} w="full" mt={8}>
          <Stack gap={4} alignItems="center">
            <Stack gap={1} alignItems="center">
              <Heading textStyle="lg" color="fg.muted" textAlign="center">
                Check your email
              </Heading>
              <Text textStyle="sm" color="fg.muted" textAlign="center">
                We sent a 6-digit code to{" "}
                <Text as="span" fontWeight="semibold" color="fg.default">
                  {submittedEmail}
                </Text>
              </Text>
            </Stack>

            <Controller
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <Field.Root invalid={!!otpForm.formState.errors.otp}>
                  <Field.Label>Enter your code</Field.Label>
                  <PinInput.Root
                    count={OTP_LENGTH}
                    onValueComplete={({ valueAsString }) =>
                      field.onChange(valueAsString)
                    }
                    otp
                    autoFocus
                  >
                    <PinInput.Control>
                      {Array.from({ length: OTP_LENGTH }, (_, i) => (
                        <PinInput.Input key={i} index={i} />
                      ))}
                    </PinInput.Control>
                    <PinInput.HiddenInput />
                  </PinInput.Root>
                  {otpForm.formState.errors.otp && (
                    <Field.ErrorText>
                      {otpForm.formState.errors.otp.message}
                    </Field.ErrorText>
                  )}
                </Field.Root>
              )}
            />

            {otpForm.formState.errors.root && (
              <Text color="error" textStyle="sm" textAlign="center">
                {otpForm.formState.errors.root.message}
              </Text>
            )}

            <Button
              type="submit"
              loading={otpForm.formState.isSubmitting}
              loadingText="Verifying..."
              w="full"
            >
              Verify code
            </Button>
            <Button
              variant="subtle"
              size="sm"
              onClick={handleBack}
              type="button"
            >
              Use a different email
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
