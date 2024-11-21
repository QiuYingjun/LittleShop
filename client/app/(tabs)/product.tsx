import SaveRecordModal from "@/components/SaveRecordModal";
import { Product, ProductAttributes } from "@/utils/models";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ToastAndroid, FlatList, ActivityIndicator, View } from "react-native";
import { useNavigation } from "expo-router";
import { Button, ListItem, Image, Text } from "@rneui/themed";
import { useFocusEffect } from "@react-navigation/native";

export default function ProductScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="添加"
          type="clear"
          onPress={() => {
            setRecord({
              name: "",
              size: "",
            });
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

  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState<ProductAttributes[]>([]);
  const loadRecords = () => {
    Product.all().then((res) => {
      setRecords(res);
    });
  };
  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [])
  );

  const saveRecord = async (data: { key: string; value: string }[]) => {
    const name = data.find((it) => it.key == "name")?.value;
    const size = data.find((it) => it.key == "size")?.value || "";
    const tags = data.find((it) => it.key == "tags")?.value;
    const image_url = data.find((it) => it.key == "image_url")?.value;
    const description = data.find((it) => it.key == "description")?.value;
    if (name) {
      return await Product.create({ name, size, tags, image_url, description })
        .then((res) => {
          alert("保存成功");
          setShowModal(false);
          loadRecords();
          return true;
        })
        .catch((e) => {
          ToastAndroid.show(e.message, ToastAndroid.SHORT);
          return false;
        });
    } else {
      alert("名称不可为空");
      return false;
    }
  };
  const deleteRecord = (id: number) => {
    Product.delete(id)
      .then((res) => {
        console.log(72, res);
        alert("删除成功");
        loadRecords();
      })
      .catch((error) => {
        console.log(87, error);
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      });
  };
  const updateRecord = (data: { key: string; value: string }[], id: number) => {
    const a: { [key: string]: any } = {};
    data.forEach((it) => {
      a[it.key] = it.value;
    });
    Product.update(id, a as ProductAttributes).then((res) => {
      setShowModal(false);
      loadRecords();
    });
  };
  const [record, setRecord] = useState<ProductAttributes>();
  const modalFields = useMemo(() => {
    return [
      {
        label: "名称",
        key: "name",
        value: record?.name || "",
      },
      {
        label: "规格",
        key: "size",
        value: record?.size || "",
      },
      {
        label: "标签",
        key: "tags",
        value: record?.tags || "",
      },
      {
        label: "图片",
        key: "image_url",
        value: record?.image_url || "",
      },
      {
        label: "备注",
        key: "description",
        value: record?.description || "",
      },
    ];
  }, [record]);
  return (
    <>
      <FlatList
        data={records}
        keyExtractor={(_, index: number) => index.toString()}
        renderItem={({ item }) => {
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
                setRecord(item);
                setShowModal(true);
              }}
            >
              <View style={{ width: 50, height: 50, display: "flex" }}>
                <Image
                  style={{
                    aspectRatio: 1,
                    width: "100%",
                    height: "100%",
                  }}
                  source={{ uri: item.image_url }}
                  PlaceholderContent={<ActivityIndicator />}
                />
              </View>
              <ListItem.Content>
                <ListItem.Title style={{ fontSize: 20, paddingBottom: 5 }}>
                  {item.name} {item.size}
                </ListItem.Title>
                {item.description && (
                  <ListItem.Subtitle style={{ fontSize: 15 }}>{item.description}</ListItem.Subtitle>
                )}
              </ListItem.Content>
              <ListItem.Chevron size={30} />
            </ListItem.Swipeable>
          );
        }}
      ></FlatList>

      <SaveRecordModal
        visible={showModal}
        title={"新建商品"}
        fields={modalFields}
        id={record?.id}
        onCancel={() => {
          setShowModal(false);
        }}
        onSave={(data, id) => {
          if (id) {
            updateRecord(data, id);
          } else {
            saveRecord(data);
          }
        }}
      ></SaveRecordModal>
    </>
  );
}
