import { Button, Input, Text } from "@/components";
import { useRouter } from "expo-router";
import { LucideChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../../theme/ThemeContext";

export default function UpdatePassword() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="flex-1 px-5 py-5 gap-3">
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
          Alterar senha
        </Text>

        <Text variant="caption" className="mt-2 mb-8" style={{ color: colors.textMuted }}>
          Crie uma nova senha para manter sua conta protegida.
        </Text>

        <View className="gap-4">
          <Input
            label="Senha atual"
            placeholder="Digite sua senha atual"
            secureTextEntry
            autoCapitalize="none"
          />

          <Input
            label="Nova senha"
            placeholder="Crie uma nova senha"
            secureTextEntry
            autoCapitalize="none"
          />

          <Input
            label="Confirmar nova senha"
            placeholder="Confirme sua nova senha"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View className="gap-1">
          <Button className="mt-8" variant="primary">
            Salvar senha
          </Button>

          <Button className="mt-3" variant="secondary" onPress={() => router.back()}>
            Cancelar
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}