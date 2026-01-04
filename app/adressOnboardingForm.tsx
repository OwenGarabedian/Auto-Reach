import {
  Text,
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
const buttonCheck = "✓";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const onboardingForm2 = () => {
  const { id } = useLocalSearchParams();
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState(buttonArrow);

  const buttonTextOpacity = useSharedValue(1);
  const progress = useSharedValue(0.50);

  useEffect(() => {
    progress.value = withTiming(0.75, { duration: 1500 });
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE - progress.value * CIRCUMFERENCE,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: buttonTextOpacity.value,
  }));

  // Helper function to safely update state from the animation thread
  const updateButtonText = () => {
    setButtonText(buttonCheck);
  };

  const buttonTextChangeAnimation = () => {
    // 1. Fade out the arrow
    buttonTextOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        // 2. Switch text on the JS thread
        runOnJS(updateButtonText)();
        // 3. Fade back in
        buttonTextOpacity.value = withTiming(1, { duration: 300 });
      }
    });
  };

  async function handleSubmition() {
    try {
      if (!street || !city || !state || !zipCode) {
        Alert.alert("Please fill in all fields.");
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .update({
          street: street,
          city: city,
          state: state,
          zipcode: zipCode,
        })
        .eq("id", id)
        .select();

      if (error) throw error;

      progress.value = withTiming(1, { duration: 1000 });
      buttonTextChangeAnimation();
      
      
      setTimeout(() => {
        router.push("/purchaseTwilioNumber");
      }, 1500);

    } catch (error: any) {
      Alert.alert("Update Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding Form 3</Text>

      <View style={styles.inputContainer}>
        <Input
          onChangeText={setStreet}
          value={street}
          placeholder="Your adress"
          autoCapitalize="none"
        />
        <Input
          onChangeText={setCity}
          value={city}
          placeholder="Your city"
          autoCapitalize="none"
        />
        <Input
          onChangeText={setState}
          value={state}
          placeholder="Your state"
          autoCapitalize="none"
        />
        <Input
          onChangeText={setZip}
          value={zipCode}
          placeholder="Your zipcode"
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
          <Animated.Text style={[styles.buttonText, animatedTextStyle]}>
            {buttonText}
          </Animated.Text>
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