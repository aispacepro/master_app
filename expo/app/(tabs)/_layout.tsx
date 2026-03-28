import { Tabs } from "expo-router";
import { ClipboardList, BarChart3 } from "lucide-react-native";
import React from "react";
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tabBar.active,
        tabBarInactiveTintColor: Colors.tabBar.inactive,
        tabBarStyle: {
          backgroundColor: Colors.tabBar.background,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Мой заказ",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Статистика",
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}