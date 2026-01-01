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
  async function signInWithEmail() {
    // fetchTableValues();

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);

    // if no error, user is signed in successfully -> bring to home screen

    fetchTableValues();

    //   if(!error){
    //     router.push('/homeScreen');
    //   }
  }

  // Sign up new user with email and password (like handle create account)
  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    // see if they user has a completed profile in 'profiles' table

    if (error) Alert.alert(error.message);
    setLoading(false);

    // if no error, user is signed up successfully -> bring to next form page (session is created if no error)
    if (session) {
      router.push("/loginNext");
    }
  }

  const fetchTableValues = async () => {
    console.log("Fetching user data for email:", email);

    try {
      setLoading(true);

      // The .from() specifies the table name, and .select() fetches the data.
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("email", email); // Filter where the 'email' column equals the email entered by the user

      console.log("Fetched user data:", data);

      if (error) {
        Alert.alert("Error fetching user data: " + error.message);
      }

      if (data && data.length > 0) {
        setUserData(data[0]);
      } else {
        Alert.alert("No user data found for the provided email.");
      }

      if (userData && userData.completed === false) {
        // Navigate to profile completion page (where they have to fill out) -> look for what fields are missing
        console.log("Navigating to correct profile info form");
      }
    } catch (err) {
      if (err) {
        Alert.alert("Error fetching user data: " + err);
      }
    } finally {
      setLoading(false);
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
