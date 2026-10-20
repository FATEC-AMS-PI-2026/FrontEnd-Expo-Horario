import { useState } from "react";
import { Button, Input, Text } from "@/components";
import { useRouter } from "expo-router";
import { LucideChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../theme/ThemeContext";

export default function UpdatePassword() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function alterarSenha() {
    setMensagem("");
    setSucesso(false);

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    if (senhaAtual === novaSenha) {
      setMensagem("A nova senha deve ser diferente da senha atual.");
      return;
    }

    if (novaSenha.length < 8) {
      setMensagem("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem("A confirmação não corresponde à nova senha.");
      return;
    }

    setSucesso(true);
    setMensagem(
      "A alteração foi concluida."
    );

    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
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

        <Text
          variant="heading"
          className="mt-6"
          style={{ color: colors.text }}
        >
          Alterar senha
        </Text>

        <Text
          variant="caption"
          className="mt-2 mb-8"
          style={{ color: colors.textMuted }}
        >
          Crie uma nova senha para manter sua conta protegida.
        </Text>

        <View className="gap-4">
          <Input
            label="Senha atual"
            placeholder="Digite sua senha atual"
            secureTextEntry
            autoCapitalize="none"
            value={senhaAtual}
            onChangeText={setSenhaAtual}
          />

          <Input
            label="Nova senha"
            placeholder="Crie uma nova senha"
            secureTextEntry
            autoCapitalize="none"
            value={novaSenha}
            onChangeText={setNovaSenha}
          />

          <Input
            label="Confirmar nova senha"
            placeholder="Confirme sua nova senha"
            secureTextEntry
            autoCapitalize="none"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
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
              style={{
                color: sucesso ? "#166534" : "#991B1B",
              }}
            >
              {mensagem}
            </Text>
          </View>
        )}

        <View className="gap-1">
          {sucesso ? (
            <Button
              className="mt-8"
              variant="primary"
              onPress={() => router.back()}
            >
              <Text>Concluir</Text>
            </Button>
          ) : (
            <Button
              className="mt-8"
              variant="primary"
              onPress={alterarSenha}
            >
              <Text>Salvar senha</Text>
            </Button>
          )}

          <Button
            className="mt-3"
            variant="secondary"
            onPress={() => router.back()}
          >
            <Text>Cancelar</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}