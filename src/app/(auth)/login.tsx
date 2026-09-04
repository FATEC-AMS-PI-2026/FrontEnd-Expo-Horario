import { LucideChevronLeft, LucideEye } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import { Button, Input, Text } from "../../components";

export default function Login() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center">
      <View className="w-full max-w-[400px]">
        <View className="mt-5 mx-5">
          <Button
            className="btn w-fit justify-center align-center"
            variant="secondary"
            size="sm"
            onPress={() => router.back()}
          >
            <View className="flex-row gap-1 items-center">
              <LucideChevronLeft size={16} />
              <Text className="text-primary m-0">Voltar</Text>
            </View>
          </Button>
        </View>

        <Text variant="heading" className="text-center mt-5">Login</Text>

        <Text variant="caption" className="text-center mt-2 mb-10">
          Insira seus dados para entrar
        </Text>

        <View className="mx-2 gap-2">
          <Input
            label="Email"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Senha"
            placeholder="Senha"
            secureTextEntry
            rightIcon={
              <Pressable>
                <Text className="text-text-accent">
                  <LucideEye size={22} />
                </Text>
              </Pressable>
            }
          />
        </View>

        <Pressable className="mx-5 mt-2 items-start">
          <Text variant="caption" className="text-text-accent">
            Esqueci minha senha
          </Text>
        </Pressable>

        <Button
          className="mx-5 mt-4"
          variant="primary"
          onPress={() => router.push("/chooseCourse")}
        >
          Entrar
        </Button>

        <Button
          className="mx-5 mt-2"
          variant="secondary"
          onPress={() => router.push("/cadastro")}
        >
          Não tem uma conta? Crie uma
        </Button>
      </View>
    </View>
  );
}
