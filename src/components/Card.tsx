import { View, type ViewProps } from "react-native";

import { useAppTheme } from "../theme/ThemeContext";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderPosition?: "all" | "top" | "bottom" | "middle";
}

const borderPositionStyles = {
  all: {
    borderWidth: 1,
    borderRadius: 12,
  },
  top: {
    borderWidth: 1,
    borderBottomWidth: 0.2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  bottom: {
    borderWidth: 1,
    borderBottomWidth: 0.2,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  middle: {
    borderWidth: 1,
    borderBottomWidth: 0.2,
    borderRadius: 0,
  },
} as const;

export function Card({
  children,
  className,
  backgroundColor,
  borderColor,
  borderPosition = "all",
  style,
  ...props
}: CardProps) {
  const { colors } = useAppTheme();

  return (
    <View
      {...props}
      style={[
        { backgroundColor: colors.surface },
        backgroundColor ? { backgroundColor } : null,
        borderColor ? { borderColor } : null,
        borderPositionStyles[borderPosition],
        style,
      ]}
      className={`rounded-xl p-4 ${className ?? ""}`}
    >
      {children}
    </View>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return <View className={`mb-2 ${className ?? ""}`}>{children}</View>;
}

export function CardContent({ children, className }: CardProps) {
  return <View className={className}>{children}</View>;
}

export function CardFooter({ children, className }: CardProps) {
  return (
    <View className={`flex-row items-center mt-4 pt-3 gap-2 border-t border-border ${className ?? ""}`}>
      {children}
    </View>
  );
}
