import { Ellipsis, User } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Button } from "./Button";
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
  accentColor = "#0B6878",
  onMorePress,
  isEmpty = false,
  isSelected = false,
  onPress,
  onLongPress,
}: ScheduleItemProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
      className={`flex-row items-center bg-white rounded-xl px-3 py-2 overflow-hidden ${
        isSelected ? "border-2 border-blue-500" : ""
      }`}
    >
      <View
        className="w-1.5 h-10 rounded-full mr-3 shrink-0"
        style={{ backgroundColor: accentColor }}
      />

      <View className="w-[58px] shrink-0 mr-1">
        <Text variant="caption" className="text-gray-600 leading-4">
          {startTime}
        </Text>
        <Text variant="caption" className="text-gray-600 mt-1.5 leading-4">
          {endTime}
        </Text>
      </View>

      <View className="flex-1 min-w-0 pr-1">
        <Text
          variant="body"
          className={isEmpty ? "text-gray-500 font-medium" : "text-black font-medium"}
          numberOfLines={1}
        >
          {isEmpty ? "Aula vazia" : subject}
        </Text>

        {!isEmpty && (
          <View className="flex-row items-center mt-0.5 gap-1">
            <User size={18} color={accentColor} strokeWidth={2.2} />
            <Text
              variant="caption"
              className="flex-1"
              style={{ color: accentColor }}
              numberOfLines={1}
            >
              {teacher}
            </Text>
            <Text
              variant="body"
              className="text-right"
              style={{ color: accentColor }}
              numberOfLines={1}
            >
              {location}
            </Text>
          </View>
        )}
          </View>


      <Button
        variant="ghost"
        size="xs"
        className="w-8 h-8 ml-1"
        onPress={onMorePress}
      >
        <Ellipsis size={22} color="#666" />
      </Button>
    </Pressable>
  );
}
