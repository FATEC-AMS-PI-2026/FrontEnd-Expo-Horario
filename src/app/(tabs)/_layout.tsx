import { Tabs } from "expo-router";
import {
    Clock4,
    House,
    IdCardLanyard,
    Library,
    Settings,
} from "lucide-react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../../theme/ThemeContext";

export default function MainLayout() {
  const { colors, darkMode } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,

        tabBarActiveTintColor: darkMode ? colors.text : "#FFFFFF",
        tabBarInactiveTintColor: darkMode ? "#94a3b8" : "#B0BEC5",

        tabBarStyle: {
          ...styles.tabBar,
          backgroundColor: darkMode ? colors.surface : "#004B57",
        },

        tabBarLabelStyle: {
          ...styles.tabBarLabel,
          color: darkMode ? colors.text : "#FFFFFF",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <House color={color} size={Math.max(size, 26)} />
          ),
        }}
      />

      <Tabs.Screen
        name="subjects"
        options={{
          title: "Matérias",
          tabBarIcon: ({ color, size }) => (
            <Clock4 color={color} size={Math.max(size, 26)} />
          ),
        }}
      />

      <Tabs.Screen
        name="classrooms"
        options={{
          title: "Salas",
          tabBarIcon: ({ color, size }) => (
            <Library color={color} size={Math.max(size, 26)} />
          ),
        }}
      />

      <Tabs.Screen
        name="professors"
        options={{
          title: "Professores",
          tabBarIcon: ({ color, size }) => (
            <IdCardLanyard color={color} size={Math.max(size, 26)} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={Math.max(size, 26)} />
          ),
        }}
      />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",

    bottom: 16,

    marginHorizontal: 16,

    height: 70,

    backgroundColor: "#004B57",
    borderRadius: 20,

    paddingTop: 8,
    paddingBottom: 10,

    borderTopWidth: 0,

    boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
  },

  tabBarLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
});