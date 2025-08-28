import { Tabs } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function _Layout() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "#6b7280",
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Menu",
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: () => null,
        }}
      />
      {isAdmin && (
        <Tabs.Screen
          name="admin"
          options={{
            title: "Admin",
            tabBarIcon: () => null,
          }}
        />
      )}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}
