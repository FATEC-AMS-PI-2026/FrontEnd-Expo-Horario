import { User, Ellipsis } from "lucide-react-native";
import { View, Pressable } from "react-native";
import { useAppTheme } from "../theme/ThemeContext";
import { Text } from "./Text";

interface ScheduleItemProps {
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  location: string;
  accentColor?: string;
  onMorePress?: () => void;
  isEmpty?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function ScheduleItem({
  startTime,
  endTime,
  subject,
  teacher,
  location,
  isEmpty = false,
  accentColor,
  onMorePress,
}: ScheduleItemProps) {
  const { colors } = useAppTheme();
  const accent = accentColor ?? colors.accent;

  return (
    <View
      className="flex-row items-center rounded-xl px-3 py-3 mb-1 overflow-hidden"
    >
      <View
        className="w-1.5 h-14 rounded-full mr-3 shrink-0"
        style={{ backgroundColor: accent }}
      />

      <View className="w-[58px] shrink-0 mr-1">
        <Text
          variant="caption"
          className="leading-4"
          style={{ color: colors.textMuted }}
        >
          {startTime}
        </Text>

        <Text
          variant="caption"
          className="mt-1.5 leading-4"
          style={{ color: colors.textMuted }}
        >
          {endTime}
        </Text>
      </View>

      <View className="flex-1 min-w-0 pr-1">
        <Text
          variant="body"
          className="font-medium"
          style={{ color: colors.text }}
          numberOfLines={1}
        >
          {isEmpty ? "Aula vazia" : subject}
        </Text>

                {!isEmpty ? (
          <View className="flex-row items-center mt-0.5 gap-1">
            <User
              size={13}
              color={accent}
              strokeWidth={2.2}
            />

            <Text
              variant="caption"
              className="flex-1"
              style={{ color: accent }}
              numberOfLines={1}
            >
              {teacher}
            </Text>
          </View>
        ) : null}
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
        <Pressable
          onPress={onMorePress}
          style={{ padding: 4 }}
        >
          <Ellipsis size={18} color={accent} />
        </Pressable>
      </View>
    </View>
  );
}