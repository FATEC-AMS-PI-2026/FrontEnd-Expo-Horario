import {
    Text
} from "@/components";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";

export default function ClassDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <View>
        <Text variant= "caption">SALAS / LAB 04</Text>
    </View>
    
    );
}