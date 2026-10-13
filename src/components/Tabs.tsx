import { useState, useCallback } from "react";
import { View, Pressable, Text, LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface Tab {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeKey, onChange, className }: TabsProps) {
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const [tabWidths, setTabWidths] = useState<Record<string, number>>({});
  const [tabPositions, setTabPositions] = useState<Record<string, number>>({});

  const onTabLayout = useCallback((key: string, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setTabWidths((prev) => ({ ...prev, [key]: width }));
    setTabPositions((prev) => ({ ...prev, [key]: x }));
  }, []);

  const activeIndex = tabs.findIndex((t) => t.key === activeKey);
  const activeX = tabPositions[activeKey] ?? 0;
  const activeWidth = tabWidths[activeKey] ?? 0;

  indicatorX.value = withSpring(activeX, { damping: 150, stiffness: 300 });
  indicatorWidth.value = withSpring(activeWidth, { damping: 150, stiffness: 300 });

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value,
  }));

  return (
    <View className={`border-b border-border ${className ?? ""}`}>
      <View className="flex-row relative">
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            onLayout={(e) => onTabLayout(tab.key, e)}
            className="flex-1 items-center py-3"
          >
            <Text
              className={`text-sm font-medium ${
                activeKey === tab.key ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
        {activeWidth > 0 && (
          <Animated.View
            className="absolute bottom-0 h-0.5 bg-primary rounded-full"
            style={indicatorStyle}
          />
        )}
      </View>
    </View>
  );
}

export function TabPanel({
  activeKey,
  panels,
}: {
  activeKey: string;
  panels: Record<string, React.ReactNode>;
}) {
  return <View className="py-3">{panels[activeKey] ?? null}</View>;
}
