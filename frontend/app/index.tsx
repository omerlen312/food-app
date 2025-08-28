import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { View, ActivityIndicator, Text } from "react-native";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="text-gray-600 mt-4">Loading...</Text>
      </View>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/signIn" />;
  }
}
