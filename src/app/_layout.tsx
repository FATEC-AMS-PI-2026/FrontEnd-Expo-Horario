import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return <Stack  screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcomeScreen" options={{ title: "Boas Vindas" }} />
        <Stack.Screen name="chooseCurse" options={{ headerShown: false }}  />
</Stack>
}
