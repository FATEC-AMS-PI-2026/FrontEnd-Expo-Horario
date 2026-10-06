import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components";
import { useAppTheme } from "../../theme/ThemeContext";

export default function AboutScreen() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar às configurações"
          onPress={() => router.replace("/(tabs)/settings")}
          style={styles.backButton}
        >
          <ArrowLeft color={colors.text} size={24} />
        </Pressable>
      </View>
      <View style={styles.contentContainer}>
        <Text variant="heading">Privacidade e segurança</Text>

        <Text variant="body" style={[styles.description, { color: colors.textMuted }]}>
          Sua privacidade é importante para nós. O aplicativo utiliza os dados fornecidos pelo usuário apenas para oferecer suas funcionalidades, como personalizar a grade semanal e facilitar o acesso aos horários acadêmicos.

As informações são armazenadas e protegidas de forma segura, buscando evitar acessos não autorizados. Não compartilhamos dados pessoais com terceiros sem a devida autorização, respeitando a privacidade e a segurança dos usuários.
        </Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 20,
  },
  description: {
    textAlign: "left",
    lineHeight: 24,
  },
});