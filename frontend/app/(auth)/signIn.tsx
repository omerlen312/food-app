import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in email and password");
      return;
    }

    try {
      await login(email, password);
      // Navigation is handled in the login function
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
            Welcome Back
          </Text>
          <Text className="text-gray-600 text-center">
            Sign in to access your account
          </Text>
        </View>

        {/* Login Form */}
        <View className="space-y-4 mb-6">
          <View>
            <Text className="text-gray-700 font-medium mb-2">Email</Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-lg px-4 py-3"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Password</Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-lg px-4 py-3"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>
        </View>

        {/* Sign In Button */}
        <Pressable
          className="bg-orange-500 rounded-lg py-4 mb-4"
          onPress={handleSignIn}
          disabled={isLoading}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
              backgroundColor: isLoading ? "#9ca3af" : "#f97316",
            },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg text-center">
              Sign In
            </Text>
          )}
        </Pressable>

        {/* Sign Up Link */}
        <View className="flex-row justify-center">
          <Text className="text-gray-600">Don't have an account? </Text>
          <Pressable onPress={() => router.push("/signUp")}>
            <Text className="text-orange-500 font-semibold">Sign Up</Text>
          </Pressable>
        </View>

        {/* Debug Info - you can remove this later */}
        <View className="mt-8 p-4 bg-gray-100 rounded-lg">
          <Text className="text-sm text-gray-600 text-center">
            Test Credentials:
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            Create an account or use existing credentials
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
