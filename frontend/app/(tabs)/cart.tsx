import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } =
    useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (productId: string, change: number) => {
    const item = cartItems.find((item) => item._id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, title: string) => {
    Alert.alert("Remove Item", `Remove ${title} from cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeFromCart(productId),
      },
    ]);
  };

  const handleCheckout = async () => {
    if (!user) {
      Alert.alert("Sign In Required", "Please sign in to place an order");
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Add some items to your cart first!");
      return;
    }

    setIsCheckingOut(true);

    try {
      // Here you would typically send the order to your backend
      // For now, we'll just simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Order Placed",
        `Your order of $${getCartTotal().toFixed(2)} has been placed successfully!`,
        [
          {
            text: "OK",
            onPress: () => clearCart(),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View className="bg-white mx-4 mb-4 p-4 rounded-xl shadow-sm border border-gray-100">
      <View className="flex-row items-center">
        <Image
          source={{ uri: item.image }}
          className="w-16 h-16 rounded-lg mr-4"
          resizeMode="cover"
        />

        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-1">
            {item.title}
          </Text>
          <Text className="text-green-600 font-semibold mb-2">
            ${item.price.toFixed(2)} each
          </Text>

          {/* Quantity Controls */}
          <View className="flex-row items-center">
            <Pressable
              className="bg-gray-200 w-8 h-8 rounded-full justify-center items-center"
              onPress={() => handleQuantityChange(item._id, -1)}
            >
              <Text className="text-gray-700 font-bold text-lg">−</Text>
            </Pressable>

            <Text className="mx-4 text-lg font-semibold text-gray-800">
              {item.quantity}
            </Text>

            <Pressable
              className="bg-orange-500 w-8 h-8 rounded-full justify-center items-center"
              onPress={() => handleQuantityChange(item._id, 1)}
            >
              <Text className="text-white font-bold text-lg">+</Text>
            </Pressable>
          </View>
        </View>

        {/* Item Total and Remove */}
        <View className="items-end">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
          <Pressable
            onPress={() => handleRemoveItem(item._id, item.title)}
            className="bg-red-100 p-2 rounded-lg"
          >
            <Text className="text-red-600 font-medium text-sm">Remove</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="px-4 py-6 bg-white shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 text-center">
            Your Cart
          </Text>
        </View>

        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-xl font-semibold text-gray-600 text-center mb-2">
            Your cart is empty
          </Text>
          <Text className="text-gray-500 text-center">
            Add some delicious items from the menu!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-6 bg-white shadow-sm">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-800">Your Cart</Text>
          <Pressable
            onPress={() => {
              Alert.alert("Clear Cart", "Remove all items from cart?", [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive", onPress: clearCart },
              ]);
            }}
            className="bg-red-100 px-3 py-2 rounded-lg"
          >
            <Text className="text-red-600 font-medium">Clear All</Text>
          </Pressable>
        </View>
        <Text className="text-gray-600 mt-1">
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart
        </Text>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item._id}
        contentContainerClassName="py-4 pb-32"
        showsVerticalScrollIndicator={false}
      />

      {/* Checkout Section */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-6 shadow-lg border-t border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-800">Total:</Text>
          <Text className="text-2xl font-bold text-green-600">
            ${getCartTotal().toFixed(2)}
          </Text>
        </View>

        <Pressable
          className="bg-orange-500 py-4 rounded-xl"
          onPress={handleCheckout}
          disabled={isCheckingOut}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
              backgroundColor: isCheckingOut ? "#9ca3af" : "#f97316",
            },
          ]}
        >
          {isCheckingOut ? (
            <View className="flex-row justify-center items-center">
              <ActivityIndicator color="white" size="small" />
              <Text className="text-white font-bold text-lg ml-2">
                Processing...
              </Text>
            </View>
          ) : (
            <Text className="text-white font-bold text-lg text-center">
              Checkout
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Cart;
