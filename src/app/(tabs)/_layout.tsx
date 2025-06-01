import { Stack, Tabs } from "expo-router";

export default function Layout() {
    return (
        <Tabs>
            <Stack.Screen name="home/index" options={{headerShown: false}}/>
        </Tabs>
    )
}