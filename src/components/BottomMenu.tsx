import {
    Clock,
    House,
    IdCardLanyard,
    Library,
    Settings
} from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Text } from "./Text";

export function BottomMenu() {
  return (
    <View className="absolute bottom-4 left-2 right-2">
      <View className="h-16 rounded-xl bg-primary flex-row items-center justify-around px-2">

        <Pressable className="h-14 w-16 rounded-xl bg-primary-dark items-center justify-center">
          <House size={20} color="#FFFFFF" />
          <Text variant="caption" className="text-white mt-1">
            Início
          </Text>
        </Pressable>

        <Pressable className="h-14 w-16 rounded-xl items-center justify-center">
          <Clock size={20} color="#FFFFFF" />
          <Text variant="caption" className="text-white mt-1">
            Matérias
          </Text>
        </Pressable>

        <Pressable className="h-14 w-16 rounded-xl items-center justify-center">
          <Library size={20} color="#FFFFFF" />
          <Text variant="caption" className="text-white mt-1">
            Salas
          </Text>
        
        </Pressable>
                <Pressable className="h-14 w-16 rounded-xl items-center justify-center">
          <IdCardLanyard size={20} color="#FFFFFF" />
          <Text variant="caption" className="text-white mt-1">
            Professores
          </Text>
        </Pressable>

        <Pressable className="h-14 w-16 rounded-xl items-center justify-center">
          <Settings size={20} color="#FFFFFF" />
          <Text variant="caption" className="text-white mt-1">
            Configurações
          </Text>
        </Pressable>

      </View>
    </View>
  );
}
