import { Switch as RNSwitch, SwitchProps as RNSwitchProps, View, Text } from "react-native";

import { useAppTheme } from "../theme/ThemeContext";

interface SwitchProps extends Omit<RNSwitchProps, "value" | "onValueChange"> {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label?: string;
}

export function Switch({ value, onValueChange, label, ...props }: SwitchProps) {
  const { colors } = useAppTheme();

  if (!label) {
    return (
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.accent }}
        {...props}
      />
    );
  }

  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-base text-foreground">{label}</Text>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.accent }}
        {...props}
      />
    </View>
  );
}
