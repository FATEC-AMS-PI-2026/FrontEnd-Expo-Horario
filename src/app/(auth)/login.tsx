import { Text, View } from "react-native";
import { Button } from "../../components";
import { router } from "expo-router";

export default function Login() {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-6">
      <Text className="text-2xl font-bold">Login</Text>

      <Button
        variant="primary"
        size="lg"
        onPress={() => router.push("/chooseCourse")}
      >
        Entrar
      </Button>

      <Button
        variant="secondary"
        size="lg"
        onPress={() => router.push("/cadastro")}
      >
        Criar cadastro
      </Button>
    </View>
  );
}