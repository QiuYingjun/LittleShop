import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Home } from "./screens/Home";
import { Product } from "./screens/Product";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Supplier } from "./screens/Supplier";
import { Order } from "./screens/Order";
import React from "react";
import { Settings } from "./screens/Settings";

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "主页",
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Product"
          component={Product}
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
        <Tab.Screen
          name="Supplier"
          component={Supplier}
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
        <Tab.Screen
          name="Order"
          component={Order}
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
        <Tab.Screen
          name="Settings"
          component={Settings}
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}
