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
            
            <Stack.Screen name = "login/index" options={{headerShown: false}}/>
            <Stack.Screen name = "recuperarSenha/index" options={{headerShown: false}}/>
            <Stack.Screen name = "cadastro/index" options={{headerShown: false}}/>
            <Stack.Screen name = "novaSenha/[id]" options={{headerShown: false}}/>
            <Stack.Screen name = "(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="detalhes/[id]" options={{ headerShown: false}} />
            
        </Stack>
    )
}