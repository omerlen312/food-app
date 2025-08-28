import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: {
      street: "",
      houseNumber: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSignUp = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.address.street ||
      !formData.address.houseNumber
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);

      const userData = {
        ...formData,
        address: {
          ...formData.address,
          houseNumber: parseInt(formData.address.houseNumber),
        },
      };

      const response = await fetch("http://192.168.1.207:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      Alert.alert(
        "Success",
        `Account created for ${data.user.name}! Please sign in.`
      );
      router.push("/signIn");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
            Create Account
          </Text>
          <Text className="text-gray-600 text-center">
            Join our burger family
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4 mb-6">
          {/* Name */}
          <View>
            <Text className="text-gray-700 font-medium mb-2">Full Name *</Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-lg px-4 py-3"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <View>
            <Text className="text-gray-700 font-medium mb-2">Email *</Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-lg px-4 py-3"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View>
            <Text className="text-gray-700 font-medium mb-2">Password *</Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-lg px-4 py-3"
              placeholder="Enter your password (min 6 chars)"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry
            />
          </View>

          {/* Address */}
          <View className="mt-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Address Information
            </Text>

            <View className="mb-3">
              <Text className="text-gray-700 font-medium mb-2">Street *</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-lg px-4 py-3"
                placeholder="Enter street name"
                value={formData.address.street}
                onChangeText={(value) =>
                  handleInputChange("address.street", value)
                }
              />
            </View>

            <View className="mb-3">
              <Text className="text-gray-700 font-medium mb-2">
                House Number *
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-lg px-4 py-3"
                placeholder="Enter house number"
                value={formData.address.houseNumber}
                onChangeText={(value) =>
                  handleInputChange("address.houseNumber", value)
                }
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Sign Up Button */}
        <Pressable
          className="bg-orange-500 rounded-lg py-4 mb-4"
          onPress={handleSignUp}
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
              Create Account
            </Text>
          )}
        </Pressable>

        {/* Sign In Link */}
        <View className="flex-row justify-center mb-8">
          <Text className="text-gray-600">Already have an account? </Text>
          <Pressable onPress={() => router.push("/signIn")}>
            <Text className="text-orange-500 font-semibold">Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
