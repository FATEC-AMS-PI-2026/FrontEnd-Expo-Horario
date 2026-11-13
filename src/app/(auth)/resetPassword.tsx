import { useLocalSearchParams, useRouter } from "expo-router";
import { LucideChevronLeft, LucideEye, LucideEyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Input, PasswordStrength, Text } from "../../components";
import { getPasswordStrength } from "../../services/validation";
import { useAppTheme } from "../../theme/ThemeContext";

type Erros = {
  senha?: string;
  confirmarSenha?: string;
};

export default function ResetPassword() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [erros, setErros] = useState<Erros>({});
  const [sucesso, setSucesso] = useState(false);

  const tokenValido = token === "token-ficticio-123";
  const forcaSenha = getPasswordStrength(senha);

  function limparErro(campo: keyof Erros) {
    setErros((atual) => (atual[campo] ? { ...atual, [campo]: undefined } : atual));
  }

  function redefinirSenha() {
    const proximos: Erros = {};

    if (!senha) {
      proximos.senha = "Informe a nova senha.";
    } else if (!forcaSenha.isStrong) {
      proximos.senha = "A senha não atende aos requisitos.";
    }

    if (!confirmarSenha) {
      proximos.confirmarSenha = "Confirme a nova senha.";
    } else if (senha !== confirmarSenha) {
      proximos.confirmarSenha = "As senhas não coincidem.";
    }

    setErros(proximos);

    if (Object.keys(proximos).length > 0) {
      return;
    }

    setSucesso(true);
    setSenha("");
    setConfirmarSenha("");
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
            Redefinir senha
          </Text>

          <Text variant="caption" className="text-center mt-2 mb-10">
            Crie uma nova senha e confirme para continuar.
          </Text>

          {!tokenValido && (
            <Text variant="caption" className="mx-5 mb-3 text-center" style={{ color: colors.danger }}>
              Token inválido. Inicie novamente a recuperação.
            </Text>
          )}

          <View className="mx-2 gap-2">
            <Input
              label="Nova senha"
              placeholder="Digite sua nova senha"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={(valor) => {
                setSenha(valor);
                setSucesso(false);
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
            <Input
              label="Confirmar nova senha"
              placeholder="Digite novamente sua senha"
              secureTextEntry={!mostrarConfirmacao}
              value={confirmarSenha}
              onChangeText={(valor) => {
                setConfirmarSenha(valor);
                setSucesso(false);
                limparErro("confirmarSenha");
              }}
              error={erros.confirmarSenha}
              rightIcon={
                <Pressable
                  onPress={() => setMostrarConfirmacao((visivel) => !visivel)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={mostrarConfirmacao ? "Ocultar confirmação da senha" : "Mostrar confirmação da senha"}
                >
                  {mostrarConfirmacao ? (
                    <LucideEyeOff size={24} color={colors.textMuted} />
                  ) : (
                    <LucideEye size={24} color={colors.textMuted} />
                  )}
                </Pressable>
              }
            />
          </View>

          {senha.length > 0 && (
            <View className="mx-2 mt-1">
              <PasswordStrength password={senha} />
            </View>
          )}

          {sucesso && (
            <View
              className="mx-2 mt-4 rounded-xl border p-3"
              style={{ backgroundColor: colors.accentSoft, borderColor: colors.accent }}
            >
              <Text variant="caption">A nova senha foi validada.</Text>
            </View>
          )}

          {sucesso ? (
            <Button
              className="mx-5 mt-4"
              variant="primary"
              onPress={() => router.replace("/login")}
            >
              Voltar para o login
            </Button>
          ) : (
            <Button
              className="mx-5 mt-4"
              variant="primary"
              onPress={redefinirSenha}
              disabled={!tokenValido || !forcaSenha.isStrong}
              accessibilityHint={
                tokenValido && !forcaSenha.isStrong
                  ? "A senha precisa atender a todos os requisitos"
                  : undefined
              }
            >
              Redefinir senha
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
