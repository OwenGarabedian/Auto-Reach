import { Text, View, StyleSheet, Pressable, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { Button, Input } from '@rneui/themed'
import { supabase } from '../lib/supabase'
import { router } from 'expo-router/build/exports'


const LoginNext = () => {

  const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
  
    // Sign in existing user with email and password (like handle login)
    async function signInWithEmail() { 
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
  
      if (error) Alert.alert(error.message)
      setLoading(false)
  
      // if no error, user is signed in successfully -> bring to home screen
      if(!error){
        router.push('/homeScreen');
      }
    }
  
    // Sign up new user with email and password (like handle create account)
    async function signUpWithEmail() {
      setLoading(true)
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
  
      if (error) Alert.alert(error.message)
      setLoading(false)
  
      // if no error, user is signed up successfully -> bring to next form page (session is created if no error)
      if(session){
        router.push('/loginNext');
      }
    }


  return (
    <View>
      <Text style={styles.title}>Log In Next</Text>
      <View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
      </View>
      </View>

      <Pressable
      style={styles.continueButton}
      >
        <Text>→</Text>
      </Pressable>
    </View>
  )
}

export default LoginNext;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 50,
    paddingTop: 20,
    letterSpacing: 1.1,
  },
  continueButton: {
    marginTop: 30,
    backgroundColor: '#63a5d1ff',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
    ...Platform.select({
        ios: {
            shadowColor: '#868686ff',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.35, 
            shadowRadius: 15,
        },
        android: {
            elevation: 12,
        },
    }),
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})