import { View } from "react-native";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <View
      className={`bg-white rounded-xl border border-border p-4 ${className ?? ""}`}
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
