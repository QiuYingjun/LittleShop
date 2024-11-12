import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const getHost = async () => {
  const host = await AsyncStorage.getItem("settings").then((res) => {
    const settings = JSON.parse(res || "{}");
    return settings.host || "http://127.0.0.1:5000";
  });
  return host;
};

abstract class ModalBase<T> {
  abstract path: string;
  create: (fields: Omit<T, "id">) => Promise<T> = async (
    fields: Omit<T, "id">
  ) => {
    const host = await getHost();
    const result = await axios
      .post(`${host}/${this.path}`, fields)
      .then(({ data }) => {
        return data as T;
      });
    return result as T;
  };
  all: () => Promise<T[]> = async () => {
    const host = await getHost();
    const result = await axios
      .get(`${host}/${this.path}`)
      .then(({ data }) => {
        return data as T[];
      })
      .catch((e) => {
        console.log(37, e);
        return [];
      });
    return result;
  };
  get: (id: number) => Promise<T | null> = async (id: number) => {
    const host = await getHost();
    const result = await axios
      .get(`${host}/${this.path}/${id}`)
      .then(({ data }) => {
        return data as T;
      })
      .catch((e) => {
        console.log(50, e);
        return null;
      });
    return result;
  };
  update: (id: number, fields: Omit<T, "id">) => Promise<T | null> = async (
    id: number,
    fields: Omit<T, "id">
  ) => {
    const host = await getHost();
    const result = await axios
      .put(`${host}/${this.path}/${id}`, fields)
      .then(({ data }) => {
        return data as T;
      })
      .catch((e) => {
        console.log(63, e);
        return null;
      });
    return result;
  };
  delete: (id: number) => Promise<T | null> = async (id: number) => {
    const host = await getHost();
    const result = await axios
      .delete(`${host}/${this.path}/${id}`)
      .then(({ data }) => {
        return data as T;
      })
      .catch((e) => {
        console.log(63, e);
        return null;
      });
    return result;
  };
}

export type SupplierAttributes = {
  id?: number;
  name: string;
  address?: string;
};

class SupplierClass extends ModalBase<SupplierAttributes> {
  path = "suppliers";
}

export const Supplier = new SupplierClass();
