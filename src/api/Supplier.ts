import { ISupplier } from "../types/Supplier.type";
import API from "./Api";

export default class Supplier {
  static async register(data: ISupplier) {
    return new API().post("/supplier", data).then((response) => {
      if (response.status !== 201) return Promise.reject(response);
      return response.data as ISupplier;
    });
  }
}
