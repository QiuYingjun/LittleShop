import { InventoryRecord, InventoryRecordAttributes, Product, Supplier } from "@/utils/models";
import React, { useCallback, useEffect, useState } from "react";
import { ToastAndroid, FlatList, View, Image } from "react-native";
import { useNavigation } from "expo-router";
import { Button, Dialog, Input } from "@rneui/themed";
import { useFocusEffect } from "@react-navigation/native";
import InventoryRecordItem from "@/components/InventoryRecordItem";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";

export default function InventoryScreen() {
  const navigation = useNavigation();
  const [productOptions, setProdutOptions] = useState<any[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<any[]>([]);
  const [productId, setProductId] = useState<number | undefined>(undefined);
  const [supplierId, setSupplierId] = useState<number | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState<InventoryRecordAttributes[]>([]);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [record, setRecord] = useState<InventoryRecordAttributes>();
  const [productOpen, setProductOpen] = useState(false);
  const [supplierOpen, setSupplierOpen] = useState(false);
  const loadRecords = () => {
    InventoryRecord.all().then((res) => {
      res.forEach((it) => {
        console.log(26, it);
      });
      setRecords(res);
    });
  };
  useEffect(() => {
    setPrice(record?.purchase_price);
    setProductId(record?.product_id);
    setSupplierId(record?.supplier_id);
    setQuantity(record?.quantity);
  }, [record]);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="添加"
          type="clear"
          onPress={() => {
            setProductOpen(false);
            setSupplierOpen(false);
            setRecord(undefined);
            setPrice(undefined);
            setProductId(undefined);
            setSupplierId(undefined);
            setQuantity(undefined);
            setShowModal(true);
          }}
        />
      ),
    });
    return () => {
      navigation.setOptions({
        headerRight: undefined,
      });
    };
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [])
  );

  const saveRecord = async () => {
    if (!productId) {
      ToastAndroid.show("未选择商品", ToastAndroid.SHORT);
      return;
    }
    if (!supplierId) {
      ToastAndroid.show("未选择供应商", ToastAndroid.SHORT);
      return;
    }
    if (!price) {
      ToastAndroid.show("未输入价格", ToastAndroid.SHORT);
      return;
    }
    if (!quantity) {
      ToastAndroid.show("未输入数量", ToastAndroid.SHORT);
      return;
    }
    if (record?.id) {
      InventoryRecord.update(record.id, {
        product_id: productId,
        supplier_id: supplierId,
        quantity: quantity,
        purchase_price: price,
      }).then((res) => {
        loadRecords();
        setShowModal(false);
        setPrice(undefined);
        setQuantity(undefined);
      });
    } else {
      InventoryRecord.create({
        product_id: productId,
        supplier_id: supplierId,
        quantity: quantity,
        purchase_price: price,
      }).then((res) => {
        loadRecords();
        setShowModal(false);
        setPrice(undefined);
        setQuantity(undefined);
      });
    }
  };

  useEffect(() => {
    if (showModal) {
      Product.all().then((res) => {
        setProdutOptions(
          res.map((it) => {
            return {
              value: it.id!,
              label: it.name + "    " + it.size,
              icon: () => (
                <Image
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  source={{ uri: it.image_url }}
                />
              ),
            };
          })
        );
      });
      Supplier.all().then((res) => {
        console.log(169, res);
        setSupplierOptions(
          res.map((it) => {
            return {
              value: it.id!,
              label: it.name,
            };
          })
        );
      });
    }
  }, [showModal]);
  return (
    <>
      <FlatList
        data={records}
        keyExtractor={(_, index: number) => index.toString()}
        renderItem={({ item }) => {
          return (
            <InventoryRecordItem
              item={item}
              key={item.id}
              onDeleted={loadRecords}
              onClick={() => {
                setRecord(item);
                setShowModal(true);
              }}
            ></InventoryRecordItem>
          );
        }}
      ></FlatList>
      <Dialog
        isVisible={showModal}
        onBackdropPress={() => {
          setShowModal(false);
        }}
      >
        <Dialog.Title title="添加进货记录" />

        <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <DropDownPicker
            zIndex={2}
            placeholder="选择商品"
            open={productOpen}
            value={productId || null}
            items={productOptions}
            setOpen={() => {
              setProductOpen(!productOpen);
            }}
            setValue={setProductId}
          />
          <DropDownPicker
            zIndex={1}
            placeholder="选择供货商"
            open={supplierOpen}
            value={supplierId || null}
            items={supplierOptions}
            setOpen={() => {
              setSupplierOpen(!supplierOpen);
            }}
            setValue={setSupplierId}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 2 }}>
              <Input
                placeholder="价格"
                value={price?.toString()}
                leftIcon={<Ionicons name="logo-yen" size={20} color="gold" />}
                onChangeText={(v) => {
                  if (v) {
                    setPrice(parseInt(v));
                  } else {
                    setPrice(undefined);
                  }
                }}
                keyboardType="numeric"
              />
            </View>

            <View style={{ flex: 2 }}>
              <Input
                placeholder="数量"
                value={quantity?.toString()}
                leftIcon={<Ionicons name="chevron-expand" size={20} color="gold" />}
                onChangeText={(v) => {
                  if (v) {
                    setQuantity(parseInt(v));
                  } else {
                    setQuantity(undefined);
                  }
                }}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <Dialog.Actions>
          <Button
            title="确定"
            type="clear"
            onPress={() => {
              saveRecord();
            }}
          />
          <Button
            title="取消"
            type="clear"
            onPress={() => {
              setShowModal(false);
            }}
          />
        </Dialog.Actions>
      </Dialog>
    </>
  );
}
