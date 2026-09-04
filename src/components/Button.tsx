import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";

type Size = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends PressableProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary active:bg-primary-dark",
  secondary: "bg-foreground transition active:bg-gray-200",
  outline: "border border-1.5 border-primary bg-transparent active:bg-muted",
  ghost: "bg-transparent transition active:bg-muted",
  destructive: "bg-error transition active:bg-red-700",
};

const sizeClasses: Record<Size, string> = {
  xs: "px-3 py-1.0 rounded-[10px]",
  sm: "px-3 py-1.5 rounded-sm",
  md: "px-4 py-3.5 rounded-[10px]",
  lg: "px-6 py-5.5 rounded-[21px]",
};

const textClasses: Record<Variant, string> = {
  primary: "text-white font-[Poppins-Regular]",
  secondary: "text-primary font-[Poppins-Regular]",
  outline: "text-primary font-[Poppins-Regular]",
  ghost: "text-foreground font-[Poppins-Regular]",
  destructive: "text-white font-[Poppins-Regular]",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
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

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={`${variantClasses[variant]} ${sizeClasses[size]} transition items-center justify-center ${
          disabled ? "opacity-50" : ""
        } ${className ?? ""}`}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={variant === "ghost" || variant === "outline" ? undefined : "#fff"} />
        ) : (
          <Text className={textClasses[variant]}>{children}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
