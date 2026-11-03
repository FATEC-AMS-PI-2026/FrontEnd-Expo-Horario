import { router } from "expo-router";
import { Alert, Image, StyleSheet, View } from "react-native";
import { Button, Text } from "../../components";

import { saveUserProfile, type UserProfile } from "../../services/userProfile";
import { useAppTheme } from "../../theme/ThemeContext";

export default function Index() {
  const { colors } = useAppTheme();

  async function escolherPerfil(profile: UserProfile) {
    try {
      await saveUserProfile(profile);
      router.push({ pathname: "/login", params: { perfil: profile } });
    } catch (error) {
      console.error("Erro ao salvar perfil do usuário:", error);
      Alert.alert("Não foi possível continuar", "Tente novamente.");
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.containerImage}>
        <Image
          source={require("../../../assets/images/cpsWelcome.png")}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text variant="heading">Gerenciador de Horários</Text>

        <Text variant="label" style={{ textAlign: "center" }}>
          Veja rapidamente os horários de aula, professores e salas do seu curso.
        </Text>

        <View style={styles.actionContainer}>
          <Text
            variant="body"
            style={{ textAlign: "center", marginBottom: 12 }}
          >
            Escolha quem você é
          </Text>

          <Button
            variant="primary"
            size="lg"
            onPress={() => escolherPerfil("aluno")}
          >
            Sou Aluno
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onPress={() => escolherPerfil("professor")}
          >
            Sou Professor
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerImage: {
    width: "100%",
    height: "50%",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 12,
  },

  actionContainer: {
    width: "100%",
    marginTop: 20,
    gap: 12,
  },
});