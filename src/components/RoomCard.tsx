import { View } from "react-native";
import { FlaskConical, BookMarked } from "lucide-react-native";
import { Card, CardHeader, CardContent } from "./Card";
import { ScheduleItem } from "./ScheduleItem";
import { StatusBadge } from "./StatusBadge";
import { Text } from "./Text";
import { useAppTheme } from "../theme/ThemeContext";

export interface CurrentClass {
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
}

export interface RoomCardProps {
  name: string;
  type: "lab" | "sala";
  currentClass?: CurrentClass; 
  accentColor?: string;
}

export function RoomCard({
  name,
  type,
  currentClass,
  accentColor = "#067f95",
}: RoomCardProps) {
  const { colors } = useAppTheme();
  const Icon = type === "lab" ? FlaskConical : BookMarked;
  const isAvailable = !currentClass;

  return (
    <Card className="mt-5 w-full rounded-xl bg-background border-gray-300">
      <CardHeader className={`w-full ${isAvailable ? "mb-0" : "mb-1"}`}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Icon size={20} color={colors.text} />
            <Text
              variant="subheading"
              style={{ color: colors.text, fontWeight: "bold" }}
            >
              {name}
            </Text>
          </View>
          <StatusBadge isAvailable={isAvailable} />
        </View>
      </CardHeader>

      {currentClass && (
        <CardContent className="w-full">
          <ScheduleItem
            {...currentClass}
            location={name}
            showLocation={false}
            embedded
            accentColor={accentColor}
          />
        </CardContent>
      )}
    </Card>
  );
}