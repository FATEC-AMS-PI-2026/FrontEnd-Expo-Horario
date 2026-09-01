import { Text as RNText, TextProps as RNTextProps } from "react-native";

type Variant = "heading" | "subheading" | "body" | "caption" | "label";

interface TextProps extends RNTextProps {
  variant?: Variant;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  heading: "text-2xl font-bold font-[Poppins-Bold] text-black",
  subheading: "text-lg font-semibold font-[Poppins-SemiBold] text-black",
  body: "text-base font-[Poppins-Regular] text-black",
  caption: "text-sm font-[Poppins-Regular] text-muted-black",
  label: "text-sm font-medium font-[Poppins-Medium] text-gray-500",
};

export function Text({ variant = "body", className, ...props }: TextProps) {
  return (
    <RNText
      className={`${variantClasses[variant]} ${className ?? ""}`}
      {...props}
    />
  );
}
