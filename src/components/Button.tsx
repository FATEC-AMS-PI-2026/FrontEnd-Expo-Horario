import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text as RNText,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useAppTheme } from "../theme/ThemeContext";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends PressableProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

const sizeStyles: Record<Size, { paddingHorizontal: number; paddingVertical: number; borderRadius: number }> = {
  xs: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  sm: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  md: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 10 },
  lg: { paddingHorizontal: 24, paddingVertical: 22, borderRadius: 21 },
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  style,
  ...props
}: ButtonProps) {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 80, stiffness: 500 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 80, stiffness: 500 });
  };

  const getVariantStyles = (): { container: Record<string, unknown>; text: Record<string, unknown> } => {
    switch (variant) {
      case "primary":
        return {
          container: { backgroundColor: colors.accent },
          text: { color: "#ffffff" },
        };
      case "secondary":
        return {
          container: { backgroundColor: colors.surfaceAlt },
          text: { color: colors.accent },
        };
      case "outline":
        return {
          container: {
            backgroundColor: "transparent",
            borderWidth: 1.5,
            borderColor: colors.accent,
          },
          text: { color: colors.accent },
        };
      case "ghost":
        return {
          container: { backgroundColor: "transparent" },
          text: { color: colors.text },
        };
      case "destructive":
        return {
          container: { backgroundColor: colors.danger },
          text: { color: "#ffffff" },
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          sizeStyles[size],
          variantStyles.container,
          { alignItems: "center", justifyContent: "center" },
          disabled ? { opacity: 0.5 } : null,
          typeof style === "function" ? undefined : style,
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={variantStyles.text.color as string} />
        ) : (
          <RNText style={[{ fontFamily: "Poppins-Regular" }, variantStyles.text]}>
            {children}
          </RNText>
        )}
      </Pressable>
    </Animated.View>
  );
}
