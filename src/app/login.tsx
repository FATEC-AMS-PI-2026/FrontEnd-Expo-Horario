import { LucideEye } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { Button } from "../components/Button";
import { Input } from "../components/Input";

export default function Login() {
  return (
    <View className="flex-1 items-center justify-center bg-muted px-6">


      <View className="mb-8 items-center">
        <Text className="mb-2 font-display text-2xl text-text-primary">
          Login
        </Text>

        <Text className="font-body text-sm text-text-secondary">
          Insira seus dados para entrar
        </Text>
      </View>


      <View className="w-full max-w-[400px] rounded-xl bg-background p-6">


        <View className="mb-5">
          <Input
            label="Email"
            placeholder="Email"
            placeholderTextColor="#66666659"
            keyboardType="email-address"
            autoCapitalize="none"
            className="font-body text-sm text-text-primary"
          />
        </View>


        <Input
          label="Senha"
          placeholder="Senha"
          placeholderTextColor="#66666659"
          secureTextEntry
          className="font-body text-sm text-text-primary"
          rightIcon={
            <Pressable>
              <Text className="text-text-accent">
                <LucideEye size={22} />
              </Text>
            </Pressable>
          }
        />


        <Pressable className="mb-5 mt-2 items-start">
          <Text className="font-body text-sm text-text-accent">
            Esqueci minha senha
          </Text>
        </Pressable>


        <Button
          variant="primary"
          size="md"
          className="h-12"
        >
          Entrar
        </Button>


        <Button
          variant="outline"
          size="md"
          className="mt-5 h-12"
        >
          Não tem uma conta? Crie uma
        </Button>

      </View>
    </View>
  );
}