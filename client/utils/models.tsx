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
  create: (fields: Omit<T, "id">) => Promise<T | null> = async (fields: Omit<T, "id">) => {
    const host = await getHost();
    const result = await axios
      .post(`${host}/${this.path}`, fields)
      .then(({ data }) => {
        return data as T;
      })
      .catch((e) => {
        return null;
      });
    return result;
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
    const result = await axios.delete(`${host}/${this.path}/${id}`).then(({ data }) => {
      return data as T;
    });
    return result;
  };
}

export type SupplierAttributes = {
  id?: number;
  name: string;
  address?: string;
};
export type ProductAttributes = {
  id?: number;
  name: string;
  size: string;
  tags?: string;
  image_url?: string;
  description?: string;
};
export type InventoryRecordAttributes = {
  id?: number;
  product_id: number;
  supplier_id: number;
  quantity: number;
  purchase_price: number;
  purchase_time?: Date;
};
export type CustomerAttributes = {
  id?: number;
  name: string;
  points: number;
};
export type OrderAttributes = {
  id?: number;
  customer_id: number;
  points_used: number;
  points_earned: number;
  total_price?: number;
};
export type SalesRecordAttributes = {
  id?: number;
  product_id: number;
  customer_id: number;
  order_id: number;
  sale_date?: Date;
  price: number;
  quantity: number;
};
export type InventorySummaryAttributes = {
  product_id: number;
  product_name: string;
  total_received: number;
  total_sold: number;
  current_stock: number;
  last_purchase_time?: Date;
  last_sale_time?: Date;
  sale_price: number;
};

class SupplierClass extends ModalBase<SupplierAttributes> {
  path = "suppliers";
}
class ProductClass extends ModalBase<ProductAttributes> {
  path = "products";
}
class InventoryRecordClass extends ModalBase<InventoryRecordAttributes> {
  path = "inventory_records";
}
class CustomerClass extends ModalBase<CustomerAttributes> {
  path = "customers";
}
class OrderClass extends ModalBase<OrderAttributes> {
  path = "orders";
  createWithRecords = async (
    fields: OrderAttributes & { sales_records: SalesRecordAttributes[] }
  ) => {
    const host = await getHost();
    const result = await axios
      .post(`${host}/${this.path}`, fields)
      .then(({ data }) => {
        return data as OrderAttributes;
      })
      .catch((e) => {
        return null;
      });
    return result;
  };
}
class SalesRecordClass extends ModalBase<SalesRecordAttributes> {
  path = "sales_records";
}
class InventorySummaryClass extends ModalBase<InventorySummaryAttributes> {
  path = "inventory_summary";
  update = () => {
    throw new Error("can not use update on inventory_summary");
  };
  create = () => {
    throw new Error("can not use create on inventory_summary");
  };
  delete = () => {
    throw new Error("can not use delete on inventory_summary");
  };
}

export const Supplier = new SupplierClass();
export const Product = new ProductClass();
export const InventoryRecord = new InventoryRecordClass();
export const Customer = new CustomerClass();
export const Order = new OrderClass();
export const SalesRecord = new SalesRecordClass();
export const InventorySummary = new InventorySummaryClass();
