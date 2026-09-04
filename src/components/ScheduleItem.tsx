import { View } from "react-native";
import { Text } from "./Text";

interface ScheduleItemProps {
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  location: string;
  accentColor?: string;
}

export function ScheduleItem({
  startTime,
  endTime,
  subject,
  teacher,
  location,
  accentColor,
}: ScheduleItemProps) {
  return (
    <View className="flex-row items-center bg-white rounded-xl px-3 py-3 mb-2">

      {/* Barra lateral */}
      {accentColor && (
        <View
          className="w-2 h-16 rounded-full mr-3"
          style={{ backgroundColor: accentColor }}
        />
      )}

      {/* Horários */}
      <View className="w-20">
        <Text variant="caption" className="text-gray-600">
          {startTime}
        </Text>

        <Text variant="caption" className="text-gray-600 mt-2">
          {endTime}
        </Text>
      </View>

      {/* Informações da aula */}
      <View className="flex-1">
        <Text variant="body" className="text-black">
          {subject}
        </Text>

        <Text variant="caption" className="text-[#0B6878] mt-1">
          Prof: {teacher}
        </Text>
      </View>

      {/* Local */}
      <View>
        <Text variant="body" className="text-[#0B6878]">
          {location}
        </Text>
      </View>

    </View>
  );
}