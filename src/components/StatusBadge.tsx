import { View } from "react-native";
import { useAppTheme } from "../theme/ThemeContext";
import { Text } from "./Text";

export function StatusBadge({ isAvailable }: { isAvailable: boolean }) {
  const { colors, darkMode } = useAppTheme();

  const dot = isAvailable ? "#10b981" : colors.danger;
  const bg = isAvailable ? (darkMode ? "#064e3b" : "#dcfce7") : colors.dangerSoft;

  return (
    <View
      className="flex-row items-center px-2 py-1 rounded-full"
      style={{ backgroundColor: bg }}
    >
      <View className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: dot }} />
      <Text style={{ color: dot, fontSize: 12, fontWeight: "600" }}>
        {isAvailable ? "Livre" : "Em utilização"}
      </Text>
    </View>
  );
}