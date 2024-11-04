import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useState } from "react";

interface SaveRecordModalType {
  visible: boolean;
  title: string;
  fields: { label: string; key: string; value: string }[];
  onCancel: () => void;
  onSave: (
    data: {
      key: string;
      value: string;
    }[]
  ) => void;
}
export default function SaveRecordModal(props: SaveRecordModalType) {
  const [fields, setFields] = useState(props.fields);
  const putValue = (key: string, value: string) => {
    const newFields: { label: string; key: string; value: string }[] = [];
    fields.forEach((it) => {
      newFields.push({
        label: it.label,
        key: it.key,
        value: it.key == key ? value : it.value,
      });
    });
    console.log(35, newFields);
    setFields(newFields);
  };
  return (
    <Modal
      visible={props.visible}
      onRequestClose={props.onCancel}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.box}>
        <View style={styles.contents}>
          <Text style={styles.title}>{props.title}</Text>
          {props.fields.map((it) => {
            return (
              <View style={styles.field} key={it.key}>
                <Text style={styles.label}>{it.label}</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(t) => {
                    putValue(it.key, t);
                  }}
                ></TextInput>
              </View>
            );
          })}
          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.cancel]}
              onPress={() => {
                props.onCancel();
              }}
            >
              <Text style={[styles.cancel]}>取消</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.save]}
              onPress={() => {
                props.onSave(fields);
              }}
            >
              <Text style={[styles.save]}>保存</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "300",
  },
  label: {
    fontSize: 20,
  },

  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  box: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000aa",
    padding: 10,
  },
  contents: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    borderWidth: 1,
    margin: 10,
    borderRadius: 10,
    borderColor: "#cccccc",
  },
  input: {
    borderColor: "#cccccc",
    borderWidth: 1,
    padding: 10,
    flex: 1,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  button: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
  },
  cancel: {
    backgroundColor: "#bbbbbb",
    color: "white",
    fontSize: 20,
  },
  save: {
    backgroundColor: "#8888ff",
    color: "white",
    fontSize: 20,
  },
});
