import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { Button, Input, Text } from "../../components";
import { useAppTheme } from "../../theme/ThemeContext";

export default function ResetPassword() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function redefinirSenha() {
    setMensagem("");
    setSucesso(false);

    if (token !== "token-ficticio-123") {
      setMensagem("Token inválido. Inicie novamente a recuperação.");
      return;
    }

    if (!senha || !confirmarSenha) {
      setMensagem("Preencha os dois campos de senha.");
      return;
    }

    if (senha.length < 8) {
      setMensagem("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    setSucesso(true);
    setMensagem(
      "A nova senha foi validada"
    );
    setSenha("");
    setConfirmarSenha("");
  }

  return (
    <View
      className="flex-1 items-center"
      style={{ backgroundColor: colors.background }}
    >
      <View className="w-full max-w-[400px] px-5">
        <Button
          variant="secondary"
          className="mt-5 self-start"
          onPress={() => router.back()}
        >
          <Text>Voltar</Text>
        </Button>

        <Text variant="heading" className="mt-8 text-center">
          Redefinir senha
        </Text>

        <Text variant="caption" className="mt-3 mb-8 text-center">
          Crie uma nova senha e confirme para continuar.
        </Text>

        <Input
          label="Nova senha"
          placeholder="Digite sua nova senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          autoCapitalize="none"
        />

        <View className="mt-4">
          <Input
            label="Confirmar nova senha"
            placeholder="Digite novamente sua senha"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            autoCapitalize="none"
          />
        </View>

        {mensagem !== "" && (
          <View
            className="mt-4 rounded-lg p-3"
            style={{
              backgroundColor: sucesso ? "#DCFCE7" : "#FEE2E2",
            }}
          >
            <Text
              style={{ color: sucesso ? "#166534" : "#991B1B" }}
            >
              {mensagem}
            </Text>
          </View>
        )}

        {sucesso ? (
          <Button
            className="mt-5"
            variant="primary"
            onPress={() => router.replace("/login")}
          >
            <Text>Voltar para o login</Text>
          </Button>
        ) : (
          <Button
            className="mt-5"
            variant="primary"
            onPress={redefinirSenha}
          >
            <Text>Redefinir senha</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
