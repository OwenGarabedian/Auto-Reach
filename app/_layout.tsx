import { Stack } from "expo-router/stack";
import {StyleSheet, Text, View} from 'react-native';

export const Layout = () => {
    return (
        // Hide the header for all screens in the stack (for all child routes)
        <Stack screenOptions={{ headerShown: false }}>
            {/* Define individual screens within the stack */}
            <Stack.Screen name="index" options={{ }} />
            <Stack.Screen name="login" options={{ }} />
        </Stack>
    );
}

export default Layout;

const styles = StyleSheet.create({});