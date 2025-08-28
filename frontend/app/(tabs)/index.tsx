import {
  FlatList,
  Pressable,
  Text,
  View,
  Alert,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { productApi, Product } from "../../api/products";
import { useCart } from "../../context/CartContext";

export default function MenuScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { addToCart, getCartItemCount } = useCart();

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await productApi.getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      Alert.alert("Error", "Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    Alert.alert(
      "Added to Cart",
      `${product.title} has been added to your cart`,
      [{ text: "OK" }]
    );
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchProducts();
  };

  const renderProduct = ({ item }: { item: Product }) => {
    return (
      <Pressable
        className="bg-white mx-4 mb-4 p-6 rounded-xl shadow-lg border border-gray-100"
        onPress={() => handleAddToCart(item)}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View className="flex-row items-center">
          <Image
            source={{ uri: item.image }}
            className="w-16 h-16 rounded-lg mr-4"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800 mb-1">
              {item.title}
            </Text>
            <Text className="text-gray-600 text-sm mb-2 leading-5">
              {item.description}
            </Text>
            <Text className="text-lg font-semibold text-green-600">
              ${item.price.toFixed(2)}
            </Text>
          </View>
          <View className="bg-orange-500 px-4 py-2 rounded-lg">
            <Text className="text-white font-semibold">Add +</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="text-gray-600 mt-4">Loading menu...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-6 bg-white shadow-sm">
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800 text-center">
              Burger Menu
            </Text>
            <Text className="text-gray-600 text-center mt-1">
              Choose your favorites
            </Text>
          </View>
          {getCartItemCount() > 0 && (
            <View className="bg-orange-500 rounded-full w-8 h-8 justify-center items-center">
              <Text className="text-white font-bold text-sm">
                {getCartItemCount()}
              </Text>
            </View>
          )}
        </View>
      </View>

      {products.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-xl text-gray-600 text-center mb-4">
            No products available
          </Text>
          <Pressable
            className="bg-orange-500 px-6 py-3 rounded-lg"
            onPress={fetchProducts}
          >
            <Text className="text-white font-semibold">Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          contentContainerClassName="py-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}
