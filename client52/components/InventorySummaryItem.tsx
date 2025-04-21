import { InventorySummaryAttributes, Product } from "@/utils/models";
import { Ionicons } from "@expo/vector-icons";
import { ListItem, Skeleton, Image, Text, Tile } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
export default function InventorySummaryItem({ item }: { item: InventorySummaryAttributes }) {
  const [product, setProduct] = useState<ProductAttributes | null>();
  useEffect(() => {
    Product.get(item.product_id).then((it) => {
      setProduct(it);
    });
  }, [item]);
  return (
    <ListItem>
      <View style={{ width: 50, height: 50, display: "flex" }}>
        {product ? (
          <Image
            style={{
              objectFit: "contain",
              aspectRatio: 1,
            }}
            source={{ uri: product?.image_url }}
            PlaceholderContent={<ActivityIndicator />}
          />
        ) : (
          <Skeleton animation="pulse" width="100%" height="100%"></Skeleton>
        )}
      </View>
      <ListItem.Content>
        <ListItem.Title>{item.product_name}</ListItem.Title>
        <ListItem.Subtitle>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <MaterialCommunityIcons name="database-import" size={20} color="black" />
            <Text style={{ fontSize: 16 }}>{item.total_received}</Text>
            <MaterialCommunityIcons name="database-export-outline" size={20} color="black" />
            <Text style={{ fontSize: 16 }}>{item.total_sold}</Text>
          </View>
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Content style={{ display: "flex", alignItems: "flex-end" }}>
        <ListItem.Title style={{ fontSize: 18, fontWeight: "bold" }}>
          售价：￥{item.sale_price}
        </ListItem.Title>
        <ListItem.Title style={{ fontSize: 16 }}>库存：{item.current_stock}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
}
