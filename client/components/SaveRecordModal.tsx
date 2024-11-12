import { View, Modal, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Input, Button, Card } from "@rneui/themed";

interface SaveRecordModalType {
  visible: boolean;
  title: string;
  id?: number;
  fields: { label: string; key: string; value: string }[];
  onCancel: () => void;
  onSave: (
    data: {
      key: string;
      value: string;
    }[],
    id?: number
  ) => void;
}
export default function SaveRecordModal(props: SaveRecordModalType) {
  const [fields, setFields] = useState(props.fields);
  useEffect(() => {
    setFields(props.fields);
  }, [props.fields]);
  const putValue = (key: string, value: string) => {
    const newFields: { label: string; key: string; value: string }[] = [];
    fields.forEach((it) => {
      newFields.push({
        label: it.label,
        key: it.key,
        value: it.key == key ? value : it.value,
      });
    });
    setFields(newFields);
  };
  return (
    <Modal
      hardwareAccelerated
      visible={props.visible}
      onRequestClose={props.onCancel}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.box}>
        <Card containerStyle={{ width: "100%" }}>
          <Card.Title h4>{props.title}</Card.Title>
          {fields.map((it) => {
            return (
              <Input
                placeholder={it.label}
                onChangeText={(t) => {
                  putValue(it.key, t);
                }}
                value={it.value}
                key={it.key}
              ></Input>
            );
          })}
          <View style={styles.actions}>
            <Button
              title="  取消  "
              type="outline"
              size="md"
              onPress={() => {
                props.onCancel();
              }}
            />
            <Button
              title="  保存  "
              size="md"
              onPress={() => {
                props.onSave(fields, props.id);
              }}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000aa",
    padding: 10,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 20,
  },
});
