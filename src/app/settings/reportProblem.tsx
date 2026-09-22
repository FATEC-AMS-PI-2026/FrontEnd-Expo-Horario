import { Button, Input, Text } from "@/components";
import { useRouter } from "expo-router";
import { LucideChevronLeft } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../../theme/ThemeContext";

const screens = [
  "Início",
  "Matérias",
  "Salas",
  "Professores",
  "Configurações",
];

export default function ReportProblem() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [description, setDescription] = useState("");
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView className="flex-1 px-5 py-5" keyboardShouldPersistTaps="handled">
        <Button
          variant="secondary"
          size="sm"
          className="w-fit"
          onPress={() => router.back()}
        >
          <View className="flex-row items-center gap-1">
            <LucideChevronLeft size={16} />
            <Text className="text-primary">Voltar</Text>
          </View>
        </Button>

        <Text variant="heading" className="mt-6" style={{ color: colors.text }}>
          Relatar problema
        </Text>

        <Text variant="caption" className="mt-2 mb-8" style={{ color: colors.textMuted }}>
          Descreva o problema que você encontrou para nos ajudar a melhorar.
        </Text>

        <View className="gap-4">
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <View className="gap-1.5">
            <Text style={{ color: colors.textMuted }} className="text-sm font-medium">
              Tela onde ocorreu o problema
            </Text>
            <Pressable
              onPress={() => setSelectorOpen(!selectorOpen)}
              style={{
                backgroundColor: colors.surfaceAlt,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 14,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: selectedScreen ? colors.text : colors.textMuted,
                  fontSize: 14,
                }}
              >
                {selectedScreen ?? "Selecione uma tela"}
              </Text>
              <Text style={{ color: colors.textMuted }}>▾</Text>
            </Pressable>

            {selectorOpen && (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  overflow: "hidden",
                  marginTop: 4,
                }}
              >
                {screens.map((screen) => (
                  <Pressable
                    key={screen}
                    onPress={() => {
                      setSelectedScreen(screen);
                      setSelectorOpen(false);
                    }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                      backgroundColor:
                        selectedScreen === screen ? colors.accentSoft : colors.surface,
                    }}
                  >
                    <Text
                      style={{
                        color: selectedScreen === screen ? colors.accent : colors.text,
                        fontSize: 14,
                      }}
                    >
                      {screen}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View className="gap-1.5">
            <Text style={{ color: colors.textMuted }} className="text-sm font-medium">
              Descrição do problema
            </Text>
            <TextInput
              placeholder="Descreva o problema detalhadamente..."
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
              style={{
                backgroundColor: colors.surfaceAlt,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 14,
                color: colors.text,
                minHeight: 280,
                fontSize: 14,
                lineHeight: 20,
              }}
            />
          </View>

          <Button className="mt-4 mb-6" variant="primary">
            Enviar relato
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
