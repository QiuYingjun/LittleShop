import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "主页",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          tabBarLabel: "商品",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "fast-food" : "fast-food-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="supplier"
        options={{
          tabBarLabel: "供货商",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "storefront" : "storefront-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          tabBarLabel: "订单",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "pricetag" : "pricetag-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "设置",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
