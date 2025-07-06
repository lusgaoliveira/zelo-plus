import { Stack } from "expo-router";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export default function Layout() {
  useEffect(() => {
    // Listener para quando a notificação for recebida com o app em primeiro plano
    const notificationReceivedListener = Notifications.addNotificationReceivedListener(notification => {
      console.log("🔔 Notificação recebida:", notification);
    });

    // Listener para quando o usuário toca na notificação
    const notificationResponseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("👉 Usuário tocou na notificação:", response);
    });

    // Configurar canal para Android
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    // Cleanup
    return () => {
      notificationReceivedListener.remove();
      notificationResponseListener.remove();
    };
  }, []);

  return (
    <Stack
      initialRouteName="login/index"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FEF6E4",
        },
      }}
    >
      <Stack.Screen name="login/index" options={{ headerShown: false }} />
      <Stack.Screen name="recuperarSenha/index" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro/index" options={{ headerShown: false }} />
      <Stack.Screen name="novaSenha/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="detalhes/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
