import React, { use, useState } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";
import { Dimensions, Platform, Pressable } from "react-native";
import { router } from "expo-router";

// Define the structure of user data fetched from the database
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

// Login screen
const Login = () => {
  // State variables for email, password, loading state, and user data
  // (setting to defalult value and will be updated later)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<userData | null>(null);

  const verifyEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  // Handles users signing in with email and password
  async function handleSignIn() {
    // set loading to true while signing in (disables button)
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    // use supabase auth to sign in with email and password
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    // if there's an error during sign in, show alert with error message(and turn off loading)
    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return; // Early return on error to avoid further processing
    }

    // fetch user data from 'profiles' table after signing in (find if profile is complete)
    const fetchedUserData = await fetchTableValues();
    handleRoutingBasedOnProfile(fetchedUserData);
    setLoading(false);
  }

  // Handles users signing up with a new email and password
  async function signUpWithEmail() {
    // set loading to true while signing up (disables button)
    setLoading(true);

    const isTrueEmail = verifyEmail();

    if(!isTrueEmail){
      Alert.alert("Invalid email, please provide a real email");
      return;
    }

    // use supabase auth to sign up with email and password
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    // if there's an error during sign up, show alert with error message(and turn off loading)
    if (error) Alert.alert(error.message);
    setLoading(false);

    // if no error, user is signed up successfully -> bring to next form page (session is created if no error)
    if (session) {
      router.push("/loginNext");
    }
  }

  const fetchTableValues = async (): Promise<userData | null> => {
    try {
      // set loading to true while fetching data (disables button)
      setLoading(true);

      // fetch user data from 'profiles' table where email matches the entered email
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .ilike("email", email);

      // if there's an error during fetching, show alert with error message
      if (error) {
        Alert.alert("Error fetching user data: " + error.message);
        return null;
      }

      // if data is returned, set the userData state to the first item (there should only be one)
      if (data && data.length > 0) {
        setUserData(data[0]);
        return data[0];
      } else {
        Alert.alert("No user data found for the provided email.");
        return null;
      }
    } catch (err) {
      // catch any unexpected errors and show alert
      Alert.alert("Error fetching user data: " + err);
      return null;
    } finally {
      // turn off loading after fetching is done
      setLoading(false);
    }
  };

  const handleRoutingBasedOnProfile = (userData: userData | null) => {
    // if userData is null, return error and stop
    if (!userData) {
      Alert.alert("Error with routing: No userData");
      return;
    }

    // check if profile is complete based on 'completed' field
    if (userData.completed) {
      // if profile is complete, navigate to main app screen
      router.push({
        pathname: "/homescreen",
        params: { id: userData.id },
      });
    } else {
      // if profile is incomplete, navigate to onboarding form based on completion level
      router.push({
        pathname: "/onboardingForm",
        params: { id: userData.id },
      });
      // needs to be implimented(after forms are complete with known data that will be asked on each)
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
          onPress={() => handleSignIn()}
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

export default Login;

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
