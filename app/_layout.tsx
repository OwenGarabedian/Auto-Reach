import { Stack } from "expo-router/stack";
import {StyleSheet, Text, View} from 'react-native';

export const Layout = () => {
    return (
        // Hide the header for all screens in the stack (for all child routes)
        <Stack screenOptions={{ headerShown: false, animation: "none", gestureEnabled: false, }}>
            {/* Define individual screens within the stack */}
            <Stack.Screen name="index" options={{ }} />
            <Stack.Screen name="login" options={{ }} />
            <Stack.Screen name="onboardingForm" options={{ }} />
            <Stack.Screen name="nextOnboardingForm" options={{ }} />
        </Stack>
    );
}

export default Layout;

const styles = StyleSheet.create({});