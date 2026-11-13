import { useLocalSearchParams, useRouter } from "expo-router";
import { LucideChevronLeft, LucideEye, LucideEyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Input, Text } from "../../components";
import { isUserProfile, saveUserProfile, type UserProfile } from "../../services/userProfile";
import { isValidEmail } from "../../services/validation";
import { useAppTheme } from "../../theme/ThemeContext";

type Erros = {
  email?: string;
  senha?: string;
  geral?: string;
};

export default function Login() {
  const router = useRouter();
  const params = useLocalSearchParams<{ perfil?: string | string[] }>();
  const profileParam = Array.isArray(params.perfil) ? params.perfil[0] : params.perfil;
  const profile: UserProfile = isUserProfile(profileParam) ? profileParam : "aluno";
  const { colors } = useAppTheme();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState<Erros>({});

  function limparErro(campo: keyof Omit<Erros, "geral">) {
    setErros((atual) =>
      atual[campo] || atual.geral ? { ...atual, [campo]: undefined, geral: undefined } : atual,
    );
  }

  async function handleLogin() {
    const proximos: Erros = {};

    if (!email.trim()) {
      proximos.email = "Informe seu email.";
    } else if (!isValidEmail(email)) {
      proximos.email = "Digite um email válido.";
    }

    if (!senha) {
      proximos.senha = "Informe sua senha.";
    }

    setErros(proximos);

    if (Object.keys(proximos).length > 0) {
      return;
    }

    try {
      await saveUserProfile(profile);
      if (profile === "professor") {
        router.replace("/home");
      } else {
        router.push("/chooseCourse");
      }
    } catch (error) {
      console.error("Erro ao salvar perfil do usuário:", error);
      setErros({ geral: "Não foi possível entrar. Tente novamente." });
    }
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background, flex: 1 }}
    >
      <View
        className="flex-1 items-center"
        style={{ backgroundColor: colors.background }}
      >
          <View className="mt-5 mx-5 self-start">
            <Button
              className="btn w-26 justify-center align-center"
              variant="secondary"
              size="sm"
              onPress={() => router.back()}
            >
              <View className="flex-row gap-1 items-center">
                <LucideChevronLeft size={24} color={colors.text} />
                <Text style={{ color: colors.text }} className="m-0">
                  Voltar
                </Text>
              </View>
            </Button>
          </View>

        <View className="w-full max-w-[400px]">
          <Text variant="heading" className="text-center mt-5">
            Login do {profile === "professor" ? "Professor" : "Aluno"}
          </Text>

          <Text variant="caption" className="text-center mt-2 mb-10">
            Insira seus dados para entrar
          </Text>

          <View className="mx-2 gap-2">
            <Input
              label="Email"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(valor) => {
                setEmail(valor);
                limparErro("email");
              }}
              error={erros.email}
            />
            <Input
              label="Senha"
              placeholder="Senha"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={(valor) => {
                setSenha(valor);
                limparErro("senha");
              }}
              error={erros.senha}
              rightIcon={
                <Pressable
                  onPress={() => setMostrarSenha((visivel) => !visivel)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? (
                    <LucideEyeOff size={24} color={colors.textMuted} />
                  ) : (
                    <LucideEye size={24} color={colors.textMuted} />
                  )}
                </Pressable>
              }
            />
          </View>

          <Pressable
            className="mx-5 mt-2 items-start"
            onPress={() => router.push("/forgotPassword")}
          >
            <Text variant="caption" className="text-text-accent">
              Esqueci minha senha
            </Text>
          </Pressable>

          {erros.geral && (
            <Text variant="caption" className="mx-5 mt-3 text-center" style={{ color: colors.danger }}>
              {erros.geral}
            </Text>
          )}

          <Button
            className="mx-5 mt-4"
            variant="primary"
            onPress={handleLogin}
          >
            Entrar
          </Button>

          <Button
            className="mx-5 mt-2"
            variant="secondary"
            onPress={() => router.push({ pathname: "/cadastro", params: { perfil: profile } })}
          >
            Não tem uma conta? Crie uma
          </Button>
        </View>
      </View>
    </SafeAreaView>

  );
}
