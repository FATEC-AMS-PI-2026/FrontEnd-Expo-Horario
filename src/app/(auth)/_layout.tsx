import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcomeScreen" />
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="chooseCourse" />
      <Stack.Screen name="periodSelectionScreen" />
    </Stack>
  );
}
