import { View, Text } from "react-native";

type Variant = "default" | "success" | "warning" | "error" | "accent";

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  error: "bg-red-100 text-red-700",
  accent: "bg-cyan-100 text-cyan-700",
};

const variantTextColor: Record<Variant, string> = {
  default: "text-muted-foreground",
  success: "text-green-700",
  warning: "text-yellow-700",
  error: "text-red-700",
  accent: "text-cyan-700",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <View
      className={`px-2.5 py-0.5 rounded-full self-start ${variantClasses[variant]} ${className ?? ""}`}
    >
      <Text className={`text-xs font-medium ${variantTextColor[variant]}`}>{children}</Text>
    </View>
  );
}
