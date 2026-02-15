import { Heading, Text } from "@/components/ui";
import { Box } from "styled-system/jsx";

export function AuthPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      maxW="md"
      w="full"
      mx="auto"
      py={{
        base: 6,
        sm: 8,
        md: 10,
      }}
      px={4}
    >
      <Box w={16} h={16}>
        <img src="/logo.webp" alt="Realm Tome Logo" />
      </Box>
      <Heading textStyle={"2xl"} mt={4}>
        Realm Tome
      </Heading>
      <Text textStyle="xl" color="fg.muted">
        Your worldbuilding companion
      </Text>

      <Heading textStyle="xl" mt={2} color="fg.muted">
        Sign up or login to get started
      </Heading>
    </Box>
  );
}
