import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
            Profile
          </Text>
        </View>

        {/* User Info */}
        {user && (
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Welcome, {user.name}!
            </Text>
            <Text className="text-gray-600 mb-4">{user.email}</Text>
            <Text className="text-sm text-gray-500">Role: {user.role}</Text>
          </View>
        )}

        {/* Logout Button */}
        <Pressable
          className="bg-red-500 rounded-lg py-4"
          onPress={logout}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text className="text-white font-semibold text-lg text-center">
            Logout
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
