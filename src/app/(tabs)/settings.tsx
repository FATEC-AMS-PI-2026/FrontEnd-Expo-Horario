import { Switch } from "@/components";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { Link, useRouter, type Href } from "expo-router";
import { BugIcon, ChevronRight, ExternalLink, KeyIcon, LogOut, Moon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../../theme/ThemeContext";

export default function Settings() {
  const { colors, darkMode, setDarkMode } = useAppTheme();
  const router = useRouter();

  const getBorderPosition = (index: number, total: number) => {
    if (total === 1) return "all";
    if (index === 0) return "top";
    if (index === total - 1) return "bottom";
    return "middle";
  };

  const generalSettings = [
    { icon: <KeyIcon color={colors.text} />, label: "Alterar Senha", action: <ChevronRight color={colors.textMuted} /> },
    { icon: <BugIcon color={colors.text} />, label: "Relatar Problema", action: <ChevronRight color={colors.textMuted} /> },
    { icon: <Moon color={colors.text} />, label: "Modo Escuro", action: null },
  ];

  const otherSettings = [
    { icon: <KeyIcon color={colors.text} />, label: "Sobre", action: <ExternalLink color={colors.textMuted} /> },
    { icon: <BugIcon color={colors.text} />, label: "Privacidade e Segurança", action: <ExternalLink color={colors.textMuted} /> },
    { icon: <Moon color={colors.text} />, label: "Termos de Uso", action: <ExternalLink color={colors.textMuted} /> },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <View className="items-center py-5">
          <Text variant="heading">Configurações</Text>
        </View>
        <View className="px-3" style={{ backgroundColor: colors.background }}>
          <View className="mb-4">
            <Text variant="body" className="mb-2">
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
                    borderColor={colors.border}
                    backgroundColor={colors.surface}
                    borderPosition={getBorderPosition(index, generalSettings.length)}
                  >
                    <View className="flex flex-row items-center gap-3">
                      {item.icon}
                      <Text>{item.label}</Text>
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
            <Text variant="body" className="mb-2">
              Outros
            </Text>
            {otherSettings.map((item, index) => {
              const isAbout = item.label === "Sobre";
              const isPrivacy = item.label === "Privacidade e Segurança";
              const isTerms = item.label === "Termos de Uso";

              const card = (
                <Card
                  className="settingsFrame flex flex-row justify-between py-3"
                  borderColor={colors.border}
                  backgroundColor={colors.surface}
                  borderPosition={getBorderPosition(index, otherSettings.length)}
                >
                  <View className="flex flex-row items-center gap-3">
                    {item.icon}
                    <Text>{item.label}</Text>
                  </View>
                  {item.action}
                </Card>
              );

              return isAbout || isPrivacy || isTerms ? (
                <Link
                  key={item.label}
                  href={
                    isAbout
                      ? "/settings/about"
                      : isPrivacy
                        ? ("/settings/private" as Href)
                        : ("/settings/term" as Href)
                  }
                  asChild
                >
                  <Pressable accessibilityRole="link">{card}</Pressable>
                </Link>
              ) : (
                <View key={item.label}>{card}</View>
              );
            })}
          </View>

          <View className="mb-4">
            <Text variant="body" className="mb-2">
              Área perigosa
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sair e voltar para a tela inicial"
              onPress={() => router.replace("/welcomeScreen")}
            >
              <Card
                className="settingsFrame flex flex-row justify-between py-3"
                backgroundColor={colors.dangerSoft}
                borderColor={colors.danger}
                borderPosition="all"
              >
                <View className="flex flex-row items-center gap-3">
                  <LogOut color={colors.danger} />
                  <Text style={{ color: colors.danger }}>Sair</Text>
                </View>
                <ChevronRight color={colors.danger} />
              </Card>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}