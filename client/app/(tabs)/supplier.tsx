import SaveRecordModal from "@/components/SaveRecordModal";
import { Supplier, SupplierAttributes } from "@/utils/models";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ToastAndroid, FlatList } from "react-native";
import { useNavigation } from "expo-router";
import { Button, ListItem } from "@rneui/themed";
import { useFocusEffect } from "@react-navigation/native";

export default function SupplierScreen() {
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
              address: "",
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
  const [records, setRecords] = useState<SupplierAttributes[]>([]);
  const loadSuppliers = () => {
    Supplier.all().then((res) => {
      setRecords(res);
    });
  };
  useFocusEffect(
    useCallback(() => {
      loadSuppliers();
    }, [])
  );

  const saveRecord = async (data: { key: string; value: string }[]) => {
    const name = data.find((it) => it.key == "name")?.value;
    const address = data.find((it) => it.key == "address")?.value;
    if (name) {
      return await Supplier.create({ name, address })
        .then((res) => {
          alert("保存成功");
          setShowModal(false);
          loadSuppliers();
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
    Supplier.delete(id).then((res) => {
      alert("删除成功");
      loadSuppliers();
    });
  };
  const updateRecord = (data: { key: string; value: string }[], id: number) => {
    const a: { [key: string]: any } = {};
    data.forEach((it) => {
      a[it.key] = it.value;
    });
    Supplier.update(id, a as SupplierAttributes).then((res) => {
      setShowModal(false);
      loadSuppliers();
    });
  };
  const [record, setRecord] = useState<SupplierAttributes>();
  const modalFields = useMemo(() => {
    return [
      {
        label: "名称",
        key: "name",
        value: record?.name || "",
      },
      {
        label: "地址",
        key: "address",
        value: record?.address || "",
      },
    ];
  }, [record]);
  return (
    <>
      <FlatList
        style={{ width: "100%" }}
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
                  buttonStyle={{ minHeight: "100%" }}
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
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.address}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem.Swipeable>
          );
        }}
      ></FlatList>

      <SaveRecordModal
        visible={showModal}
        title={"新建供货商"}
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
