import { View } from "react-native";
import { User } from "lucide-react-native";
import { Text } from "./Text";
import { useAppTheme } from "../theme/ThemeContext";

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
  const { colors } = useAppTheme();
  const accent = accentColor ?? colors.accent;

  return (
    <View className="flex-row items-center rounded-xl px-3 py-3 mb-1 overflow-hidden" style={{ backgroundColor: colors.surface }}>
      <View
        className="w-1.5 h-14 rounded-full mr-3 shrink-0"
        style={{ backgroundColor: accent }}
      />

      <View className="w-[58px] shrink-0 mr-1">
        <Text variant="caption" className="leading-4" style={{ color: colors.textMuted }}>
          {startTime}
        </Text>
        <Text variant="caption" className="mt-1.5 leading-4" style={{ color: colors.textMuted }}>
          {endTime}
        </Text>
      </View>

      <View className="flex-1 min-w-0 pr-1">
        <Text
          variant="body"
          className="font-medium"
          style={{ color: colors.text }}
          numberOfLines={2}
        >
          {subject}
        </Text>

        <View className="flex-row items-center mt-0.5 gap-1">
          <User size={13} color={accent} strokeWidth={2.2} />
          <Text
            variant="caption"
            className="flex-1"
            style={{ color: accent }}
            numberOfLines={1}
          >
            {teacher}
          </Text>
        </View>
      </View>

      <View className="shrink-0 max-w-[72px] items-end">
        <Text
          variant="body"
          className="text-right"
          style={{ color: accent }}
          numberOfLines={1}
        >
          {location}
        </Text>
      </View>
    </View>
  );
}
