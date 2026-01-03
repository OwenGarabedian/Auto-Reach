import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Button, Input } from "@rneui/themed";
import { supabase } from "../lib/supabase";
import { router } from "expo-router/build/exports";
import { useLocalSearchParams } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import { Circle, Svg } from "react-native-svg";
import { useEffect } from "react";

const { width, height } = Dimensions.get("screen");

const SIZE = 90; // Size of the SVG container
const STROKE_WIDTH = 6;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE_WIDTH * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// set the progress percentage (e.g., 33% -> 66% for this screen)
// creates the animatable version of Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const LoginNext = () => {
  const { id } = useLocalSearchParams();
  const [businessName, setBusinessName] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");
  const [loading, setLoading] = useState(false);

  // sefines shared value starting at .33 (33%)
  const progress = useSharedValue(0.33);

  useEffect(() => {
    // animates to 0.66 (66%) when the component mounts
    progress.value = withTiming(0.66, { duration: 1500 });
  }, []);

  // maps the shared value to SVG props
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE - progress.value * CIRCUMFERENCE,
  }));

  // handles form submition
  async function handleSubmition() {
    try {
      setLoading(true);

      if (businessName == "") {
        Alert.alert("Please input your business name.");

        setLoading(false);
        return;
      }

      if (businessWebsite == "") {
        Alert.alert("Invalid website, please input a valid Url");

        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles") // in progfile table
        .update({
          // provides an object with the fields and their new values
          business_name: businessName,
          website_url: businessWebsite,
        })
        .eq("id", id) // uses a filter to target the specific row
        .select(); // uses .select() to return the updated rows (incase I need them)

      if (error) {
        throw error;
      }
      router.push("/nextOnboardingForm");


      console.log("Profile updated successfully:", data);
      return data;
    } catch (error) {
      console.error("Error updating profile:");
      return;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding Form 2</Text>

      <View style={styles.inputContainer}>
        <Input
          onChangeText={(text) => setBusinessName(text)}
          value={businessName}
          placeholder="Your Business Name"
          autoCapitalize={"none"}
        />
        <Input
          onChangeText={(text) => setBusinessWebsite(text)}
          value={businessWebsite}
          placeholder=" Your Businesses Website URL"
        />
      </View>

      {/* BUTTON WITH CIRCULAR PROGRESS */}
      <View style={styles.buttonWrapper}>
        <Svg width={SIZE} height={SIZE} style={styles.svg}>
          {/* Background Circle (Gray track) */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke="#E0E0E0"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {/* Progress Circle (Colored) */}
          <AnimatedCircle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            stroke="#63a5d1"
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProps} //uses animated props
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

export default LoginNext;

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
  svg: {
    position: "absolute", // Places the SVG behind the button
  },
  continueButton: {
    backgroundColor: "#63a5d1",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensures button is clickable over the SVG
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
