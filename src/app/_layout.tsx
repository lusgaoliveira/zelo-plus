import { Stack } from "expo-router";

export default function Layout() {
    return(
        <Stack>

            <Stack.Screen name = "login/index"/>
            <Stack.Screen name = "recuperarSenha/index"/>
            <Stack.Screen name = "cadastro/index"/>

        </Stack>
    )
}