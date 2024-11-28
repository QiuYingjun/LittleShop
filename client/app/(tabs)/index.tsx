import InventorySummaryItem from "@/components/InventorySummaryItem";
import { InventorySummary, InventorySummaryAttributes } from "@/utils/models";
import { ListItem } from "@rneui/base";
import { Button, Skeleton } from "@rneui/themed";
import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function Page() {
  const [records, setRecords] = useState<InventorySummaryAttributes[]>([]);
  const loadRecords = () => {
    InventorySummary.all().then((res) => {
      console.log(11, res);
      setRecords(res);
    });
  };
  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [])
  );
  return (
    <FlatList
      data={records}
      keyExtractor={(_, index: number) => index.toString()}
      renderItem={({ item }) => {
        return <InventorySummaryItem item={item}></InventorySummaryItem>;
      }}
    ></FlatList>
  );
}
