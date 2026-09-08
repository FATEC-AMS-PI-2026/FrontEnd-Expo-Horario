import { View } from "react-native";
import { User } from "lucide-react-native";
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
  accentColor = "#0B6878",
}: ScheduleItemProps) {
  return (
    <View className="flex-row items-center bg-white rounded-xl px-3 py-3 mb-1 overflow-hidden">
      {/* Barra lateral */}
      <View
        className="w-1.5 h-14 rounded-full mr-3 shrink-0"
        style={{ backgroundColor: accentColor }}
      />

      {/* Horários */}
      <View className="w-[58px] shrink-0 mr-1">
        <Text variant="caption" className="text-gray-600 leading-4">
          {startTime}
        </Text>
        <Text variant="caption" className="text-gray-600 mt-1.5 leading-4">
          {endTime}
        </Text>
      </View>

      {/* Informações da aula */}
      <View className="flex-1 min-w-0 pr-1">
        <Text
          variant="body"
          className="text-black font-medium"
          numberOfLines={2}
        >
          {subject}
        </Text>

        <View className="flex-row items-center mt-0.5 gap-1">
          <User size={13} color="#0B6878" strokeWidth={2.2} />
          <Text
            variant="caption"
            className="text-[#0B6878] flex-1"
            numberOfLines={1}
          >
            {teacher}
          </Text>
        </View>
      </View>

      {/* Local */}
      <View className="shrink-0 max-w-[72px] items-end">
        <Text
          variant="body"
          className="text-[#0B6878] text-right"
          numberOfLines={1}
        >
          {location}
        </Text>
      </View>
    </View>
  );
}
