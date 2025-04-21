import React, { useEffect, useState } from "react";
import { Input, Dialog, Button } from "@rneui/themed";

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
    <>
      <Dialog isVisible={props.visible} onBackdropPress={props.onCancel}>
        <Dialog.Title title={props.title} />
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
        <Dialog.Actions>
          <Button
            title="保存"
            type="clear"
            onPress={() => {
              props.onSave(fields, props.id);
            }}
          />
          <Button
            title="取消"
            type="clear"
            onPress={() => {
              props.onCancel();
            }}
          />
        </Dialog.Actions>
      </Dialog>
    </>
  );
}
