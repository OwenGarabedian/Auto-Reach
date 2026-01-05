import {
  Text
  View,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Input } from "@rneui/themed";
import { supabase } from "../lib/supabase";
import { router } from "expo-router"; // Fixed import
import { useLocalSearchParams } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  useAnimatedStyle,
  runOnJS, // Required for state updates in callbacks
} from "react-native-reanimated";
import { Circle, Svg } from "react-native-svg";

const { width, height } = Dimensions.get("screen");
const SIZE = 90;
const STROKE_WIDTH = 6;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE_WIDTH * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const buttonArrow = "→";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const onboardingForm2 = () => {
  const { id } = useLocalSearchParams();
  const [businessName, setBusinessName] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState(buttonArrow);

  const buttonTextOpacity = useSharedValue(1);
  const progress = useSharedValue(0.25);

  useEffect(() => {
    progress.value = withTiming(0.50, { duration: 1500 });
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE - progress.value * CIRCUMFERENCE,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: buttonTextOpacity.value,
  }));

  async function handleSubmition() {
    try {
      if (!businessName || !businessWebsite) {
        Alert.alert("Please fill in all fields.");
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .update({
          business_name: businessName,
          website_url: businessWebsite,
        })
        .eq("id", id)
        .select();

      if (error) throw error;

    } catch (error: any) {
      Alert.alert("Update Error", error.message);
    } finally {
      router.push({
        pathname: "/adressOnboardingForm",
        params: { id: id },
      });
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding Form 2</Text>

      <View style={styles.inputContainer}>
        <Input
          onChangeText={setBusinessName}
          value={businessName}
          placeholder="Your Business Name"
          autoCapitalize="none"
        />
        <Input
          onChangeText={setBusinessWebsite}
          value={businessWebsite}
          placeholder="Your Business Website URL"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Svg width={SIZE} height={SIZE} style={styles.svg}>
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke="#E0E0E0"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <AnimatedCircle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke="#63a5d1"
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProps}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
          />
        </Svg>

        <Pressable
          onPress={handleSubmition}
          disabled={loading}
          style={({ pressed }) => [
            styles.continueButton,
            loading && styles.disabledButton,
            pressed && !loading && styles.pressedButton,
          ]}
        >
          <Text style={styles.buttonText}>→</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default onboardingForm2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 50,
    letterSpacing: 1.1,
  },
  inputContainer: { marginTop: 20, paddingHorizontal: 20 },
  buttonWrapper: {
    marginTop: 50,
    width: SIZE,
    height: SIZE,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  svg: { position: "absolute" },
  continueButton: {
    backgroundColor: "#63a5d1",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: { elevation: 8 },
    }),
  },
  disabledButton: { opacity: 0.7 },
  pressedButton: { opacity: 0.7 },
  buttonText: { color: "white", fontSize: 24, fontWeight: "bold" },
});
