import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { productApi, Product } from "../../api/products";

const Admin = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state for adding products
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setIsRefreshing(true);
      const fetchedProducts = await productApi.getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      Alert.alert("Error", "Failed to load products");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddProduct = async () => {
    if (!formData.title || !formData.price || !formData.description) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (title, price, description)"
      );
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    try {
      setIsLoading(true);

      const productData = {
        title: formData.title,
        price: price,
        image:
          formData.image ||
          "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
        description: formData.description,
      };

      const response = await fetch("http://192.168.1.207:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add product");
      }

      Alert.alert("Success", `${formData.title} has been added to the menu!`);

      // Reset form
      setFormData({
        title: "",
        price: "",
        image: "",
        description: "",
      });
      setShowAddForm(false);

      // Refresh products list
      fetchProducts();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
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
          <Text className="text-green-600 font-semibold mb-1">
            ${item.price.toFixed(2)}
          </Text>
          <Text className="text-gray-600 text-sm" numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
    </View>
  );

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-6">
        <Text className="text-xl font-semibold text-gray-600 text-center mb-2">
          Access Denied
        </Text>
        <Text className="text-gray-500 text-center">
          This page is only accessible to administrators.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-6 bg-white shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 text-center">
          Admin Panel
        </Text>
        <Text className="text-gray-600 text-center mt-1">
          Manage your menu items
        </Text>
      </View>

      {/* Add Product Button */}
      <View className="px-4 py-4">
        <Pressable
          className="bg-orange-500 py-3 rounded-lg"
          onPress={() => setShowAddForm(!showAddForm)}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text className="text-white font-bold text-center text-lg">
            {showAddForm ? "Cancel" : "Add New Product"}
          </Text>
        </Pressable>
      </View>

      {/* Add Product Form */}
      {showAddForm && (
        <View className="bg-white mx-4 mb-4 p-6 rounded-xl shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Add New Product
          </Text>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Product Title *
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="Enter product title"
                value={formData.title}
                onChangeText={(value) => handleInputChange("title", value)}
              />
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Price ($) *
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="Enter price (e.g., 8.99)"
                value={formData.price}
                onChangeText={(value) => handleInputChange("price", value)}
                keyboardType="numeric"
              />
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Image URL (optional)
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="Enter image URL or leave empty for default"
                value={formData.image}
                onChangeText={(value) => handleInputChange("image", value)}
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Description *
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                placeholder="Enter product description"
                value={formData.description}
                onChangeText={(value) =>
                  handleInputChange("description", value)
                }
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <Pressable
              className="bg-green-500 py-3 rounded-lg mt-4"
              onPress={handleAddProduct}
              disabled={isLoading}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: isLoading ? "#9ca3af" : "#10b981",
                },
              ]}
            >
              {isLoading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-bold ml-2">Adding...</Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-center">
                  Add Product
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      )}

      {/* Products List */}
      <View className="flex-1">
        <View className="px-4 pb-2">
          <Text className="text-lg font-semibold text-gray-800">
            Current Menu ({products.length} items)
          </Text>
        </View>

        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          contentContainerClassName="pb-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={fetchProducts}
            />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-12">
              <Text className="text-xl text-gray-600 text-center mb-4">
                No products in menu
              </Text>
              <Text className="text-gray-500 text-center">
                Use the "Add New Product" button above to add your first item
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Admin;
