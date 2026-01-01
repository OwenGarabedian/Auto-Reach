import { Text, View, StyleSheet, Pressable, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { Button, Input } from '@rneui/themed'
import { supabase } from '../lib/supabase'
import { router } from 'expo-router/build/exports'


const LoginNext = () => {

  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  
    // handles form submition
    async function handleSubmition() { 
      
    }
  
  return (
    <View>
      <Text style={styles.title}>Onboarding Form 1</Text>
      <View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          placeholder="Full Name"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          onChangeText={(text) => setPhoneNumber(text)}
          value={phoneNumber}
          placeholder="Phone Number"
        />
      </View>

      </View>

      <Pressable
      onPress={handleSubmition}
      disabled={loading}

      style={({ pressed }) => [ 
        styles.continueButton,
        loading ? styles.dissabledcontinueButton : styles.continueButton,
        pressed && !loading && styles.dissabledcontinueButton,
      ]}
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
  dissabledcontinueButton: {
    marginTop: 30,
    backgroundColor: '#ff0000ff',
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