import { BlocksDataSource } from "./data";

export interface Context {
  dataSources: {
    blocks: BlocksDataSource;
  };
}
