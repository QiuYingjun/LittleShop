import {
  InventoryRecord,
  InventoryRecordAttributes,
  Product,
  ProductAttributes,
  Supplier,
  SupplierAttributes,
} from "@/utils/models";
import { ListItem, Button, Image, Skeleton, Text } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ToastAndroid, View } from "react-native";
import { cdate } from "cdate";
export default function InventoryRecordItem({
  item,
  onDeleted,
  onClick,
}: {
  item: InventoryRecordAttributes;
  onDeleted: () => void;
  onClick: () => void;
}) {
  const [product, setProduct] = useState<ProductAttributes | null>();
  const [supplier, setSupplier] = useState<SupplierAttributes | null>();
  useEffect(() => {
    Product.get(item.product_id).then((it) => {
      setProduct(it);
    });
    Supplier.get(item.supplier_id).then((it) => {
      setSupplier(it);
    });
  }, [item]);
  const deleteRecord = (id: number) => {
    InventoryRecord.delete(id)
      .then((res) => {
        console.log(72, res);
        alert("删除成功");
        onDeleted();
      })
      .catch((error) => {
        console.log(87, error);
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      });
  };
  return (
    <ListItem.Swipeable
      key={item.id}
      bottomDivider
      rightContent={
        <Button
          title="删除"
          color="error"
          icon={{ name: "delete", color: "white" }}
          buttonStyle={{ height: "100%" }}
          onPress={() => {
            deleteRecord(item.id!);
          }}
        />
      }
      onPress={() => {
        onClick();
      }}
    >
      <View style={{ width: 50, height: 50, display: "flex" }}>
        {product ? (
          <Image
            style={{
              aspectRatio: 1,
              width: "100%",
              height: "100%",
            }}
            source={{ uri: product?.image_url }}
            PlaceholderContent={<ActivityIndicator />}
          />
        ) : (
          <Skeleton animation="pulse" width="100%" height="100%"></Skeleton>
        )}
      </View>

      <ListItem.Content>
        {product ? (
          <ListItem.Title style={{ fontSize: 20, paddingBottom: 5 }}>
            {product?.name} {product.size}
          </ListItem.Title>
        ) : (
          <Skeleton animation="pulse" width={"80%"} height={20}></Skeleton>
        )}
        {supplier ? (
          <View style={{ display: "flex", flexDirection: "row", alignItems: "baseline", gap: 10 }}>
            <Text style={{ fontSize: 15 }}>{supplier?.name}</Text>
            <Text style={{ fontSize: 10 }}>
              {cdate(item.purchase_time).add(9, "hours").format("YYYY-MM-DD HH:mm")}
            </Text>
          </View>
        ) : (
          <Skeleton animation="pulse" width={"40%"} height={15}></Skeleton>
        )}
      </ListItem.Content>
      {product ? (
        <ListItem.Content style={{ display: "flex", alignItems: "flex-end" }}>
          <ListItem.Title style={{ fontSize: 16, fontWeight: "bold" }}>
            ￥{item.purchase_price}
          </ListItem.Title>
          <ListItem.Subtitle style={{ fontSize: 12 }}>x {item.quantity}</ListItem.Subtitle>
        </ListItem.Content>
      ) : (
        <Skeleton animation="pulse" width={20} height={20}></Skeleton>
      )}
      <ListItem.Chevron size={30} />
    </ListItem.Swipeable>
  );
}
