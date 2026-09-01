import { Switch as RNSwitch, SwitchProps as RNSwitchProps, View, Text } from "react-native";

interface SwitchProps extends Omit<RNSwitchProps, "value" | "onValueChange"> {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label?: string;
}

export function Switch({ value, onValueChange, label, ...props }: SwitchProps) {
  if (!label) {
    return (
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#e4e4e7", true: "#005C6E" }}
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
        trackColor={{ false: "#e4e4e7", true: "#005C6E" }}
        {...props}
      />
    </View>
  );
}
