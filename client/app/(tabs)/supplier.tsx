import SaveRecordModal from "@/components/SaveRecordModal";
import { Supplier } from "@/utils/models";
import React, { useEffect, useState } from "react";
import { View, Button, ToastAndroid } from "react-native";

export default function SupplierScreen() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const loadSuppliers = () => {
    Supplier.all().then((res) => {
      console.log(13, res);
      setSuppliers(res);
    });
  };
  useEffect(() => {
    loadSuppliers();
  }, []);

  const saveRecord = async (data: { key: string; value: string }[]) => {
    const name = data.find((it) => it.key == "name")?.value;
    const address = data.find((it) => it.key == "address")?.value;
    if (name) {
      return await Supplier.create({ name, address })
        .then((res) => {
          console.log(20, res);
          alert("保存成功");
          setShowModal(false);
          setName("");
          setAddress("");
          loadSuppliers();
          return true;
        })
        .catch((e) => {
          ToastAndroid.show(e.message, ToastAndroid.SHORT);
          console.log(36, e);
          return false;
        });
    } else {
      alert("名称不可为空");
      return false;
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        title="添加"
        onPress={() => {
          setShowModal(true);
        }}
      />
      <SaveRecordModal
        visible={showModal}
        title={"新建供货商"}
        fields={[
          {
            label: "名称",
            key: "name",
            value: name,
          },
          {
            label: "地址",
            key: "address",
            value: address,
          },
        ]}
        onCancel={() => {
          setShowModal(false);
        }}
        onSave={(data) => {
          saveRecord(data);
        }}
      ></SaveRecordModal>
    </View>
  );
}
