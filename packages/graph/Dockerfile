# --------------> The build image
FROM node:lts AS build

WORKDIR /usr/src/

COPY packages/graph/tmp/*.graphql .
COPY packages/graph/tmp/supergraph-docker.yaml supergraph.yaml
COPY packages/graph/config/router.yaml router.yaml

ENV APOLLO_ELV2_LICENSE accept

RUN npx -p @apollo/rover rover supergraph compose --config supergraph.yaml > supergraph.graphql
 
# --------------> The production image
FROM ghcr.io/apollographql/router:v1.14.0

COPY --from=build /usr/src/router.yaml /dist/config/router.yaml
COPY --from=build /usr/src/supergraph.graphql /dist/schema/supergraph.graphql

ENV APOLLO_ROUTER_SUPERGRAPH_PATH /dist/schema/supergraph.graphql
