import "../../global.css";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <Text className="text-xl font-bold text-secundary-dark">
        Edit src/app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}
