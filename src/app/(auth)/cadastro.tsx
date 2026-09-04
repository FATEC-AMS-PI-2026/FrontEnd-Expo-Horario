import { Text, View } from "react-native";
import { Button } from "../../components";
import { router } from "expo-router";

export default function Cadastro() {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-6">
      <Text className="text-2xl font-bold">Cadastro</Text>

      <Button
        variant="primary"
        size="lg"
        onPress={() => router.push("/chooseCourse")}
      >
        Finalizar cadastro
      </Button>
    </View>
  );
}