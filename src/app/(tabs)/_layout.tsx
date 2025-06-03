import { Tabs, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const { dados } = useLocalSearchParams();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007aff",
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
        initialParams={{ dados }}
      />
      <Tabs.Screen
        name="criarTarefa/index"
        options={{
          title: "Adicionar Tarefa",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
        initialParams={{ dados }}
      />
      <Tabs.Screen
        name="perfil/index"
        options={{
          title: "Seu Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
        initialParams={{ dados }}
      />
    </Tabs>
  );
}
