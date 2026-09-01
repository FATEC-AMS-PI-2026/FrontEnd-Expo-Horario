import { useState } from "react";
import { Pressable, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  LayoutChangeEvent,
  runOnJS,
} from "react-native-reanimated";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentHeight = useSharedValue(0);
  const animatedHeight = useSharedValue(defaultOpen ? 1 : 0);

  const handleLayout = (e: LayoutChangeEvent) => {
    contentHeight.value = e.nativeEvent.layout.height;
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    animatedHeight.value = withSpring(next ? 1 : 0, {
      damping: 150,
      stiffness: 600,
    });
  };

  const contentStyle = useAnimatedStyle(() => ({
    height: contentHeight.value * animatedHeight.value,
    opacity: animatedHeight.value,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withSpring(`${animatedHeight.value * 90}deg`, {
          damping: 150,
          stiffness: 600,
        }),
      },
    ],
  }));

  return (
    <View className={`border-b border-border ${className ?? ""}`}>
      <Pressable
        onPress={toggle}
        className="flex-row items-center justify-between py-4 px-4"
      >
        <Text className="text-base font-medium text-text-primary flex-1">
          {title}
        </Text>
        <Animated.View style={chevronStyle}>
          <Text className="text-muted-foreground text-lg">›</Text>
        </Animated.View>
      </Pressable>
      <Animated.View style={contentStyle} className="overflow-hidden  px-4">
        <View onLayout={handleLayout} className="pb-4">
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ children, className }: AccordionProps) {
  return <View className={`border border-border rounded-xl overflow-hidden ${className ?? ""}`}>{children}</View>;
}
