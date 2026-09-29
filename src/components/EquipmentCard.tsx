import {
    Armchair,
    Cable,
    Laptop,
    Monitor,
    Wifi
} from "lucide-react-native";
import { View } from "react-native";

import { useAppTheme } from "../theme/ThemeContext";
import { Text } from "./Text";

interface Equipment {
  name: string;
  icon: React.ReactNode;
}

export function EquipmentCard() {
  const { colors } = useAppTheme();

  const equipments: Equipment[] = [
    {
      name: "Wi-fi",
      icon: <Wifi size={16} color={colors.text} strokeWidth={2} />,
    },
    {
      name: "Televisões",
      icon: <Monitor size={16} color={colors.text} strokeWidth={2} />,
    },
    {
      name: "Cadeiras",
      icon: <Armchair size={16} color={colors.text} strokeWidth={2} />,
    },
    {
      name: "Computadores",
      icon: <Laptop size={16} color={colors.text} strokeWidth={2} />,
    },
  ];

  return (
    <View
      className="rounded-xl p-3 mb-3"
      style={{ backgroundColor: colors.surfaceAlt }}
    >
        <View className="flex-row items-center mb-3">
        <Cable
            size={16}
            color={colors.text}
            strokeWidth={2}
        />

        <Text
            variant="body"
            className="font-semibold ml-2"
            style={{ color: colors.text }}
        >
            Equipamentos
        </Text>
        </View>

      <View className="gap-2.5">
        {equipments.map((equipment) => (
          <View
            key={equipment.name}
            className="flex-row items-center rounded-lg px-2 h-[50px] border"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <View className="mr-3">
              {equipment.icon}
            </View>

            <Text
              variant="label"
              style={{ color: colors.text }}
            >
              {equipment.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}