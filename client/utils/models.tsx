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
  create = async (fields: Omit<T, "id">) => {
    const host = await getHost();
    console.log(19, `${host}/${this.path}`);
    const result = await axios
      .post(`${host}/${this.path}`, fields)
      .then(({ data }) => {
        console.log(31, data);
        return data;
      });
    return result;
  };
  all = async () => {
    const host = await getHost();
    const result = await axios
      .get(`${host}/${this.path}`)
      .then(({ data }) => {
        console.log(31, data);
        return data;
      })
      .catch((e) => {
        console.log(36, e);
      });
    return result;
  };
  get = async (id: number) => {
    const host = await getHost();
    const result = await axios
      .get(`${host}/${this.path}/${id}`)
      .then(({ data }) => {
        console.log(31, data);
        return data;
      })
      .catch((e) => {
        console.log(36, e);
      });
    return result;
  };
  update = async (id: number, fields: Omit<T, "id">) => {
    const host = await getHost();
    const result = await axios
      .put(`${host}/suppliers/${id}`, fields)
      .then(({ data }) => {
        console.log(31, data);
        return data;
      })
      .catch((e) => {
        console.log(36, e);
      });
    return result;
  };
}

type SupplierAttributes = {
  id: number;
  name: string;
  address?: string;
};

class SupplierClass extends ModalBase<SupplierAttributes> {
  path = "suppliers";
}

export const Supplier = new SupplierClass();
