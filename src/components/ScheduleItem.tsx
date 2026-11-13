import { User, Ellipsis } from "lucide-react-native";
import { View, Pressable } from "react-native";
import { useAppTheme } from "../theme/ThemeContext";
import { Text } from "./Text";
import type { ReactNode } from "react";

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
  children?: ReactNode;
  isCurrent?: boolean;
  hideMore?: boolean;
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
  children,
  isCurrent = false,
  hideMore = false,
}: ScheduleItemProps) {
  const { colors, darkMode } = useAppTheme();
  const accent = accentColor ?? colors.accent;

  return (
    <View
      className="flex-row items-center rounded-xl px-3 py-3 mb-1 overflow-hidden"
      style={{
        backgroundColor: isCurrent
          ? darkMode ? colors.accentSoft : "rgba(6, 182, 212, 0.10)"
          : "transparent",
      }}
    >
      <View
        className="w-1.5 min-h-14 self-stretch rounded-full mr-3 shrink-0"
        style={{ backgroundColor: accent }}
      />

      <View className="w-16 shrink-0 mr-2">
        <Text
          variant="caption"
          className="leading-4 font-medium"
          style={{ color: colors.textMuted }}
        >
          {startTime}
        </Text>

        <Text
          variant="caption"
          className="mt-1.5 leading-4 font-medium"
          style={{ color: colors.textMuted }}
        >
          {endTime}
        </Text>
      </View>

      <View className="flex-1 min-w-0 pr-1">
        {isCurrent && (
          <Text variant="caption" className="font-bold mb-1" style={{ color: accent }}>
            Em andamento
          </Text>
        )}
        <Text
          variant="body"
          className="font-medium"
          style={{ color: colors.text }}
          numberOfLines={children ? undefined : 1}
        >
          {isEmpty ? "Aula vazia" : subject}
        </Text>

        {!isEmpty && teacher ? (
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
        {children}
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
        {!hideMore && <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Opções de ${isEmpty ? "aula vazia" : subject}, ${startTime}`}
          onPress={onMorePress}
          style={{ padding: 4 }}
        >
          <Ellipsis size={18} color={accent} />
        </Pressable>}
      </View>
    </View>
  );
}
