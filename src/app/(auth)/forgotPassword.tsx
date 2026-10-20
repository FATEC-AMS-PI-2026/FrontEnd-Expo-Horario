import { useState } from "react";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button, Input, Text } from "../../components";
import { useAppTheme } from "../../theme/ThemeContext";

export default function ForgotPassword() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function solicitarRecuperacao() {
    setMensagem("");
    setSucesso(false);

    const emailFormatado = email.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailFormatado) {
      setMensagem("Por favor, digite seu e-mail.");
      return;
    }

    if (!regexEmail.test(emailFormatado)) {
      setMensagem("Digite um e-mail válido. Exemplo: nome@email.com");
      return;
    }

    setSucesso(true);
    setMensagem(
      "Solicitação simulada com sucesso! Você pode continuar para a redefinição de senha."
    );
  }

  function irParaRedefinicao() {
    router.push({
      pathname: "/resetPassword",
      params: { token: "token-ficticio-123" },
    });
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
          Recuperar senha
        </Text>

        <Text variant="caption" className="mt-3 mb-8 text-center">
          Digite seu e-mail para iniciar a recuperação de senha.
        </Text>

        <Input
          label="E-mail"
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

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
            onPress={irParaRedefinicao}
          >
            <Text>Continuar para redefinição</Text>
          </Button>
        ) : (
          <Button
            className="mt-5"
            variant="primary"
            onPress={solicitarRecuperacao}
          >
            <Text>Enviar link de recuperação</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
