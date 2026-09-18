import { Switch } from "@/components";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { useRouter } from "expo-router";
import { BugIcon, ChevronRight, ExternalLink, KeyIcon, LogOut, Moon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../../theme/ThemeContext";

export default function Settings() {
  const { darkMode, setDarkMode } = useAppTheme();
  const router = useRouter();
  const isDark = darkMode;

  const theme = isDark
    ? {
        background: "#111827",
        surface: "#1f2937",
        border: "#374151",
        text: "#f9fafb",
        muted: "#d1d5db",
        dangerBackground: "#3f0d0d",
        dangerText: "#fca5a5",
        dangerBorder: "#ef4444",
      }
    : {
        background: "#ffffff",
        surface: "#ffffff",
        border: "#d1d5db",
        text: "#111827",
        muted: "#374151",
        dangerBackground: "#fef2f2",
        dangerText: "#ef4444",
        dangerBorder: "#ef4444",
      };

  const getBorderPosition = (index: number, total: number) => {
    if (total === 1) return "all";
    if (index === 0) return "top";
    if (index === total - 1) return "bottom";
    return "middle";
  };

  const generalSettings = [
    { icon: <KeyIcon color={theme.text} />, label: "Alterar Senha", action: <ChevronRight color={theme.muted} /> },
    { icon: <BugIcon color={theme.text} />, label: "Relatar Problema", action: <ChevronRight color={theme.muted} /> },
    { icon: <Moon color={theme.text} />, label: "Modo Escuro", action: null },
  ];

  const otherSettings = [
    { icon: <KeyIcon color={theme.text} />, label: "Sobre", action: <ExternalLink color={theme.muted} /> },
    { icon: <BugIcon color={theme.text} />, label: "Privacidade e Segurança", action: <ExternalLink color={theme.muted} /> },
    { icon: <Moon color={theme.text} />, label: "Termos de Uso", action: <ExternalLink color={theme.muted} /> },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View className="flex-1" style={{ backgroundColor: theme.background }}>
        <View className="items-center py-5">
          <Text variant="heading" style={{ color: theme.text }}>Configurações</Text>
        </View>
        <View className="px-3" style={{ backgroundColor: theme.background }}>
          <View className="mb-4">
            <Text variant="body" className="mb-2" style={{ color: theme.text }}>
              Configurações gerais
            </Text>
            {generalSettings.map((item, index) => {
              const isChangePassword = item.label === "Alterar Senha";
              const isDarkModeToggle = item.label === "Modo Escuro";

              return (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    if (isChangePassword) router.push("/settings/updatePassword");
                    if (item.label === "Relatar Problema") router.push("/settings/reportProblem");
                  }}
                  disabled={!isChangePassword && item.label !== "Relatar Problema"}
                >
                  <Card
                    className="settingsFrame flex flex-row justify-between py-3"
                    borderColor={theme.border}
                    backgroundColor={theme.surface}
                    borderPosition={getBorderPosition(index, generalSettings.length)}
                  >
                    <View className="flex flex-row items-center gap-3">
                      {item.icon}
                      <Text style={{ color: theme.text }}>{item.label}</Text>
                    </View>
                    {isDarkModeToggle ? (
                      <Switch value={darkMode} onValueChange={setDarkMode} />
                    ) : (
                      item.action
                    )}
                  </Card>
                </Pressable>
              );
            })}
          </View>

          <View className="mb-4">
            <Text variant="body" className="mb-2" style={{ color: theme.text }}>
              Outros
            </Text>
            {otherSettings.map((item, index) => (
              <Card
                key={item.label}
                className="settingsFrame flex flex-row justify-between py-3"
                borderColor={theme.border}
                backgroundColor={theme.surface}
                borderPosition={getBorderPosition(index, otherSettings.length)}
              >
                <View className="flex flex-row items-center gap-3">
                  {item.icon}
                  <Text style={{ color: theme.text }}>{item.label}</Text>
                </View>
                {item.action}
              </Card>
            ))}
          </View>

          <View className="mb-4">
            <Text variant="body" className="mb-2" style={{ color: theme.text }}>
              Área perigosa
            </Text>

            <Card
              className="settingsFrame flex flex-row justify-between py-3"
              backgroundColor={theme.dangerBackground}
              borderColor={theme.dangerBorder}
              borderPosition="all"
            >
              <View className="flex flex-row items-center gap-3">
                <LogOut color={theme.dangerText} />
                <Text style={{ color: theme.dangerText }}>Sair</Text>
              </View>
              <ChevronRight color={theme.dangerText} />
            </Card>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}