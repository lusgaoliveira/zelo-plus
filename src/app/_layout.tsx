import { Stack } from "expo-router";

export default function Layout() {
    return(
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#FEF6E4"
                },
            }}
        >
            
            <Stack.Screen name = "login/index" options={{title : "Login"}}/>
            <Stack.Screen name = "recuperarSenha/index" options={{title : "Recuperar Senha"}}/>
            <Stack.Screen name = "cadastro/index" options={{title: "Cadastro"}}/>
            <Stack.Screen name = "(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="detalhes/[id]" options={{ headerShown: false, headerTitle: "" }} />
        </Stack>
    )
}