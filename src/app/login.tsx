import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";

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
          <Text className="mb-2 font-display text-sm text-text-primary">
            Email
          </Text>

          <TextInput
            className="h-12 rounded-lg border border-border bg-background px-3.5 font-body text-sm text-text-primary"
            placeholder="Email"
            placeholderTextColor="#66666659"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        
        <View>
          <Text className="mb-2 font-display text-sm text-text-primary">
            Senha
          </Text>

          <View className="h-12 flex-row items-center rounded-lg border border-border bg-background">
            <TextInput
              className="h-full flex-1 px-3.5 font-body text-sm text-text-primary"
              placeholder="Senha"
              placeholderTextColor="#66666659"
              secureTextEntry
            />

            <Pressable className="px-3.5">
              <Ionicons
                name="eye-outline"
                size={22}
                color="#005C6E"
              />
            </Pressable>
          </View>
        </View>

        
        <Pressable className="mb-5 mt-2 items-start">
          <Text className="font-body text-sm text-text-accent">
            Esqueci minha senha
          </Text>
        </Pressable>

        
        <Pressable className="h-12 items-center justify-center rounded-lg bg-primary">
          <Text className="font-display text-sm text-text-inverse">
            Entrar
          </Text>
        </Pressable>

        
        <Pressable className="mt-5 h-12 items-center justify-center rounded-lg border border-primary bg-background">
          <Text className="font-display text-sm text-text-accent">
            Não tem uma conta? Crie uma
          </Text>
        </Pressable>

      </View>
    </View>
  );
}