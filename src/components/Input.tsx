import { ReactNode, useState } from "react";
import { TextInput, TextInputProps, View, Text } from "react-native";

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

  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-sm font-medium text-gray-400">{label}</Text>
      )}
      <View
        className={`flex-row transition items-center bg-white border outline-none rounded-xl ${
          focused ? "border-ring ring-2 ring-ring/30" : "border-border"
        } ${error ? "border-error" : ""}`}
      >
        {leftIcon && <View className="pl-3">{leftIcon}</View>}
        <TextInput
          placeholderTextColor="#71717a"
          className={`focus:outline-none flex-1 px-3 py-3.5 text-base text-foreground ${className ?? ""}`}
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
      {error && <Text className="text-xs text-error">{error}</Text>}
    </View>
  );
}
