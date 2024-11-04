import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function Settings() {
  const [host, setHost] = useState("");
  useEffect(() => {
    AsyncStorage.getItem("settings").then((res) => {
      const settings = JSON.parse(res || "{}");
      setHost(settings.host || "");
    });
  }, []);

  const handleSave = () => {
    AsyncStorage.setItem("settings", JSON.stringify({ host: host })).then(
      (res) => {
        alert("保存成功");
      }
    );
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
          placeholderTextColor={"#cccccc"}
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
