# 🛒 E-commerce Supergraph

This monorepo is a demo for [Apollo Federation v2](https://www.apollographql.com/docs/federation) and [Apollo Router](https://www.apollographql.com/docs/router). The monorepo is managed by [Turborepo](https://turbo.build/repo).

The supergraph is intended for a hypothetical e-commerce site and is intended to demonstrate how to use Apollo Federation to combine data from multiple sources into a single GraphQL API. It uses data sourced from the [Nintendo eShop](https://www.nintendo.com/eshop/).

## Installation

This project requires **at least Node.js v18**.

To install the dependencies:

```bash
npm install
```

This should also install the dependencies and run the build scripts for the subgraphs and shared libraries. If you want to run the build scripts again, you can use:

```bash
npm run build
```

## Getting Started

The fastest way to get started is to use [Docker Compose](https://docs.docker.com/compose/) to run the supergraph and the subgraphs. After installing with `npm install`, you can run the project with:

```bash
docker compose up
```

You can then open the GraphQL Playground at [http://localhost:4000](http://localhost:4000) to explore the graph.

### Without Docker

If you don't want to use Docker, you can run the subgraphs and the supergraph locally. First, you will need to install the [Apollo Router](https://www.apollographql.com/docs/router) binary to a temporary directory in the project. You can do this by running:

```bash
npm run local-router -w graph
```

Then, you can run the subgraphs and the supergraph locally.

```bash
npm run dev
```

## Querying the Supergraph

The supergraph is a GraphQL API that combines the functionality of the subgraphs. It is a single GraphQL endpoint that you can query with a single query. When you start the project, either with `npm run dev` or `docker compose up`, the supergraph is available at [http://localhost:4000](http://localhost:4000).

Two subgraphs are available: `content` and `ecommerce`. The `content` subgraph provides the content for the hypothetical e-commerce site. The `content` subgraph returns "Content Blocks", which can be thought of as discrete elements of content, comprising of text and data, that could be used to add data to a specific front-end component. The `ecommerce` subgraph provides the e-commerce functionality; in this case, it allows us to query the products.

Consider the following query:

```graphql
query TopProducts($limit: Int) {
  topProducts {
    title
    description
    products(limit: $limit) {
      sku
      name
      price
      description
    }
  }
}
```

In this query, we are querying the `topProducts` field, which is defined in the `content` subgraph. This subgraph provides the `title` and `description` fields. We are also querying the `products` field, which is defined in the `ecommerce` subgraph. The subgraph returns a composite of the Content Block for the top products, and the products themselves.

### How is a "top product" determined?

The products have been augmented with two additional properties: `avg_rating` and `total_sales`. These properties are not defined in the `Product` type in the `ecommerce` subgraph. In a real-world scenario, these properties would be aggregated by a separate service, and the `ecommerce` subgraph would include these properties. However, for the purposes of this demo, I have just randomly generated the values for these properties.

A "top product" is calulated by multiplying `avg_rating` with `total_sales`, and then sorting the products by this value. The top 10 products are returned by default. This is a naive way of determining the top products, but it is sufficient for the purposes of this demo. In a real app, you could use a more sophisticated algorithm, such as a weighted average, to determine the top products.

## Development

If you want to run the build scripts, you can use:

```bash
npm run build
```

To rebuild the supergraph schema and shared types (found in the `graph` package):

```bash
npm run build -w graph
```

Version management configuration for Node.js is provided for [`volta`](https://volta.sh/). I recommend you have this installed to automatically switch between Node.js versions when you enter one of our project directories. This allows for more deterministic and reproducible builds, which makes debugging easier.

You use `volta` to configure the project to use the latest LTS version of Node.js by running:

```bash
volta pin node@lts
```

You can run this command again to update the version.
