import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import storage from "../utils/storage";

export function Settings() {
  const [host, setHost] = useState("");
  useEffect(() => {
    console.log(8, storage);
    if (storage) {
      storage
        .load({ key: "settings" })
        .then((ret) => {
          setHost(ret.host);
        })
        .catch((err) => {
          console.log(err.message);
          switch (err.name) {
            case "NotFoundError":
              // TODO;
              break;
            case "ExpiredError":
              // TODO
              break;
          }
        });
    }
  }, [storage]);
  const handleSave = () => {
    storage
      .save({
        key: "settings",
        data: {
          host,
        },
      })
      .then(() => {
        alert("保存成功");
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>服务器Host：</Text>
        <TextInput
          style={styles.input}
          value={host}
          onChangeText={setHost}
          placeholder="http://127.0.0.1:5000"
        />
      </View>
      <Button title="保存" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  container: {
    flexDirection: "column",
    padding: 10,
    flex: 1,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    flex: 1,
    borderRadius: 5,
  },
});
