import React, { useState } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";
import { Dimensions, Platform, Pressable } from "react-native";
import { router } from "expo-router";

interface userData {
  id: string;
  email: string;
  full_name: string;
  business_name: string;
  phone_number: string;
  website_url: string;
  status: string;
  text_on: boolean;
  call_on: boolean;
  created_at: string;
  completed: boolean;
}

const { width } = Dimensions.get("screen");

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<userData | null>(null);

  // Sign in existing user with email and password (like handle login)
  // --- Logic: Sign In ---
  async function handleSignIn() {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login Failed", error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await checkProfileStatus(data.user.id);
    }
    setLoading(false);
  }

  // --- Logic: Sign Up ---
  async function handleSignUp() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Sign Up Error", error.message);
    } else if (session) {
      router.push("/loginNext");
    }
    setLoading(false);
  }

  // --- Logic: Profile Check ---
  const checkProfileStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("completed")
      .eq("id", userId)
      .single();

    if (error) {
      console.log(error)
    }

    if (data?.completed) {
      router.replace("/homeScreen");
    } else {
      router.push("/loginNext");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create An Account</Text>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </View>
      <Text>User Data: [{JSON.stringify(userData)}]</Text>
    </View>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    paddingTop: width * 0.15,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
