import DataLoader from 'dataloader';

const CONTENT = [
  {
    slug: 'top-products',
    title: 'Top Products',
    description: 'The top products in our store',
    products: [] // This gets resolved later in the other subgraph
  }
];

/**
 * Data source for content blocks.
 *
 * This is a simple example of a data source that uses DataLoader to
 * batch requests to the underlying data source.
 *
 * In a real-world application, this would be a class that connects to
 * a database or other data source.
 */
export class BlocksDataSource {
  getBlockFor(slug: string) {
    return this.batchBlocks.load(slug);
  }

  getAllBlocks() {
    return CONTENT;
  }

  private batchBlocks = new DataLoader(async slugs =>
    slugs.map(slug => CONTENT.find(block => block.slug === slug))
  );
}
