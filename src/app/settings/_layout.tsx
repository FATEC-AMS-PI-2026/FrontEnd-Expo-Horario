import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="about" />
      <Stack.Screen name="private" />
      <Stack.Screen name="reportProblem" />
      <Stack.Screen name="term" />
      <Stack.Screen name="updatePassword" />
    </Stack>
  );
}
