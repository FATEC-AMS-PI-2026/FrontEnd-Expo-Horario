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
        <Text variant="heading">Termos de uso</Text>

        <Text variant="body" style={[styles.description, { color: colors.textMuted }]}>
          Este aplicativo foi desenvolvido para facilitar a organização da rotina acadêmica dos alunos. Nele, é possível consultar os horários dos cursos, salas e laboratórios, além de verificar os horários em que cada professor está lecionando.

O aplicativo também permite que o aluno monte sua própria grade semanal, escolhendo as disciplinas que deseja cursar, inclusive matérias de DP. Dessa forma, o estudante consegue visualizar seus horários de forma simples e organizada, facilitando o planejamento da sua semana acadêmica.
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