import { Text as RNText, TextProps as RNTextProps } from "react-native";

import { useAppTheme } from "../theme/ThemeContext";

type Variant = "heading" | "subheading" | "body" | "caption" | "label";

interface TextProps extends RNTextProps {
  variant?: Variant;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  heading: "text-2xl font-bold font-[Poppins-Bold]",
  subheading: "text-lg font-semibold font-[Poppins-SemiBold]",
  body: "text-base font-[Poppins-Regular]",
  caption: "text-sm font-[Poppins-Regular]",
  label: "text-sm font-medium font-[Poppins-Medium]",
};

export function Text({ variant = "body", className, style, ...props }: TextProps) {
  const { colors } = useAppTheme();

  return (
    <RNText
      className={`${variantClasses[variant]} ${className ?? ""}`}
      style={[{ color: colors.text }, style]}
      {...props}
    />
  );
}
