import { ReactNode, useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

import { useAppTheme } from "../theme/ThemeContext";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  className,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const { colors, darkMode } = useAppTheme();

  return (
    <View className="gap-1.5">
      {label && (
        <Text style={{ color: colors.textMuted }} className="text-sm font-medium">
          {label}
        </Text>
      )}
      <View
        style={{
            backgroundColor: darkMode ? colors.backgroundAlt : colors.background,
          borderColor: focused ? colors.accent : colors.border,
          borderWidth: 1,
          borderRadius: 12,
        }}
        className="flex-row transition items-center outline-none"
      >
        {leftIcon && <View className="pl-3">{leftIcon}</View>}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={{
            color: colors.text,
            flex: 1,
            paddingHorizontal: 12,
            paddingVertical: 14,
          }}
          className={className ?? ""}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon && <View className="pr-3">{rightIcon}</View>}
      </View>
      {error && <Text style={{ color: colors.danger }}>{error}</Text>}
    </View>
  );
}
