import {
    Clock,
    House,
    IdCardLanyard,
    Library,
    Settings
} from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Text } from "./Text";
import { useAppTheme } from "../theme/ThemeContext";

export function BottomMenu() {
  const { colors } = useAppTheme();

  return (
    <View className="absolute bottom-4 left-2 right-2">
      <View className="h-16 rounded-xl flex-row items-center justify-around px-2" style={{ backgroundColor: colors.accent }}>

        <Pressable className="h-14 w-16 rounded-xl items-center justify-center" style={{ backgroundColor: colors.accent }}>
          <House size={20} color={colors.text} />
          <Text variant="caption" className="mt-1" style={{ color: colors.text }}>
            Início
          </Text>
        </Pressable>

        <Pressable className="h-14 w-16 rounded-xl items-center justify-center">
          <Clock size={20} color={colors.text} />
          <Text variant="caption" className="mt-1" style={{ color: colors.text }}>
            Matérias
          </Text>
        </Pressable>

        <Pressable className="h-14 w-16 rounded-xl items-center justify-center">
          <Library size={20} color={colors.text} />
          <Text variant="caption" className="mt-1" style={{ color: colors.text }}>
            Salas
          </Text>
        </Pressable>

        <Pressable className="h-14 w-16 rounded-xl items-center justify-center">
          <IdCardLanyard size={20} color={colors.text} />
          <Text variant="caption" className="mt-1" style={{ color: colors.text }}>
            Professores
          </Text>
        </Pressable>

        <Pressable className="h-14 w-16 rounded-xl items-center justify-center">
          <Settings size={20} color={colors.text} />
          <Text variant="caption" className="mt-1" style={{ color: colors.text }}>
            Configurações
          </Text>
        </Pressable>

      </View>
    </View>
  );
}
