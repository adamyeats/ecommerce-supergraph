import { ProductDataSource } from "./data";

export interface Context {
  dataSources: {
    products: ProductDataSource;
  };
}
