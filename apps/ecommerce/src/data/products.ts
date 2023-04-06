import DataLoader from 'dataloader';
import fs from 'node:fs';
import path from 'node:path';

/**
 * A product in our store.
 */
export interface Product {
  sku: string;
  name: string;
  price: number;
  description: string;
  avg_rating: number;
  total_sales: number;
}

/**
 * The list of products in our store, parsed from a JSON file.
 */
export const PRODUCTS: Product[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../src/data/products.json'), {
    encoding: 'utf-8'
  })
);

/**
 * Data source for products.
 *
 * This is a simple example of a data source that uses DataLoader to
 * batch requests to the underlying data source.
 *
 * In a real-world application, this would be a class that connects to
 * a database or other data source.
 */
export class ProductDataSource {
  getProduct(sku: string) {
    return this.batchProducts.load(sku);
  }

  getAllProducts() {
    return PRODUCTS;
  }

  getProducts({ limit = 10, offset = 0 }) {
    return PRODUCTS.slice(offset, offset + limit);
  }

  getTopProducts(limit: number) {
    // Note: this is very naive, it only really works if we assume
    // that every customer who bought the item also rated it, which
    // may not be the case.
    return this.getAllProducts()
      .sort(
        (a, b) => b.avg_rating * b.total_sales - a.avg_rating * a.total_sales
      )
      .slice(0, limit);
  }

  private batchProducts = new DataLoader(async skus =>
    skus.map(sku => PRODUCTS.find(product => product.sku === sku))
  );
}
