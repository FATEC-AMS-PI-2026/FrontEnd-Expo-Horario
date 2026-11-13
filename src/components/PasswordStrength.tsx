import { LucideCheck, LucideX } from "lucide-react-native";
import { View } from "react-native";

import { getPasswordStrength, type PasswordStrengthLevel } from "../services/validation";
import { useAppTheme } from "../theme/ThemeContext";
import { Text } from "./Text";

interface PasswordStrengthProps {
  password: string;
}

const SEGMENTS = [0, 1, 2, 3];
const SUCCESS_COLOR = "#16A34A";
const WARNING_COLOR = "#F59E0B";

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { colors } = useAppTheme();
  const strength = getPasswordStrength(password);

  const levelColors: Record<PasswordStrengthLevel, string> = {
    fraca: colors.danger,
    comum: WARNING_COLOR,
    boa: colors.accent,
    excelente: SUCCESS_COLOR,
  };
  const levelColor = levelColors[strength.level];

  return (
    <View
      className="gap-2 rounded-xl border p-3"
      style={{ backgroundColor: colors.backgroundAlt, borderColor: colors.border }}
    >
      <View className="flex-row items-center justify-between">
        <Text variant="caption" style={{ color: colors.textMuted }}>
          Força da senha
        </Text>
        <Text variant="label" style={{ color: levelColor }}>
          {strength.label}
        </Text>
      </View>

      <View
        className="flex-row gap-1"
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={`Força da senha: ${strength.label}`}
        accessibilityValue={{ min: 1, max: 4, now: strength.score }}
      >
        {SEGMENTS.map((segment) => (
          <View
            key={segment}
            className="h-1.5 flex-1 rounded-full"
            style={{
              backgroundColor: segment < strength.score ? levelColor : colors.border,
            }}
          />
        ))}
      </View>

      <View className="gap-1">
        {strength.requirements.map((requirement) => (
          <View key={requirement.label} className="flex-row items-center gap-1.5">
            {requirement.met ? (
              <LucideCheck size={14} color={SUCCESS_COLOR} />
            ) : (
              <LucideX size={14} color={colors.textMuted} />
            )}
            <Text
              variant="caption"
              style={{ color: requirement.met ? colors.text : colors.textMuted }}
            >
              {requirement.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
