import { Tabs } from "expo-router";
import {
  Clock4,
  House,
  IdCardLanyard,
  Library,
  Settings,
} from "lucide-react-native";
import { StyleSheet } from "react-native";

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#B0BEC5",

        tabBarStyle: styles.tabBar,

        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <House color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="subjects"
        options={{
          title: "Matérias",
          tabBarIcon: ({ color, size }) => (
            <Clock4 color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="classrooms"
        options={{
          title: "Salas",
          tabBarIcon: ({ color, size }) => (
            <Library color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="professors"
        options={{
          title: "Professores",
          tabBarIcon: ({ color, size }) => (
            <IdCardLanyard color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
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

    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  tabBarLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
});