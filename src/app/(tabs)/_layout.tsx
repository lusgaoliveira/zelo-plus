import { Tabs, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const { dados } = useLocalSearchParams();
  const usuario = dados ? JSON.parse(dados as string) : null;
  const tipoUsuario = usuario?.tipoUsuario;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FFB956",
        tabBarInactiveTintColor: "#000",
        tabBarStyle: {
          backgroundColor: "#FFFAEC",
          borderTopWidth: 0,
          height: 100,
          paddingBottom: 20,
          paddingTop: 10,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={30} color={color} />
          ),
        }}
        initialParams={{ dados }}
      />

      <Tabs.Screen
        name="criarTarefa/index"
        options={{
          title: "Adicionar Tarefa",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={30} color={color} />
          ),
        }}
        initialParams={{ dados }}
      />

      <Tabs.Screen
        name="perfil/index"
        options={{
          title: "Seu Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={30} color={color} />
          ),
        }}
        initialParams={{ dados }}
      />

      <Tabs.Screen
        name="relatorio/index"
        options={{
          title: "Relatório",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bar-chart-outline" size={30} color={color} />
          ),
          // Oculta a aba para IDOSO
          tabBarButton: tipoUsuario === "IDOSO" ? () => null : undefined,
        }}
        initialParams={{ dados }}
      />
    </Tabs>
  );
}
