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
          borderTopWidth: 1,
          height: 125, 
          paddingTop: 25, 
          paddingBottom: 25, 
          elevation: 0,
          justifyContent: tipoUsuario === "IDOSO" ? 'flex-start' : 'space-around',
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          width: tipoUsuario === "IDOSO" ? 100 : 'auto', // limita largura do botão
          marginRight: tipoUsuario === "IDOSO" ? 20 : 0, // cria espaçamento
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 15,
        },
      }}
    >

      <Tabs.Screen
        name="home/index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={35} color={color} />
          ),
        }}
        initialParams={{ dados }}
      />

      <Tabs.Screen
        name="criarTarefa/index"
        options={{
          title: "Adicionar Tarefa",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={35} color={color} />
          ),
        }}
        initialParams={{ dados }}
      />

      <Tabs.Screen
        name="perfil/index"
        options={{
          title: "Seu Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={35} color={color} />
          ),
        }}
        initialParams={{ dados }}
      />

      <Tabs.Screen
        name="relatorio/index"
        options={{
          title: "Relatório",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bar-chart-outline" size={35} color={color} />
          ),
          // Oculta a aba para IDOSO
          tabBarButton: tipoUsuario === "IDOSO" ? () => null : undefined,
        }}
        initialParams={{ dados }}
      />
    </Tabs>
  );
}
