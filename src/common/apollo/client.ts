import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: `https://gateway.thegraph.com/api/${process.env.REACT_APP_THE_GRAPH_API_KEY}/subgraphs/id/0x0a0319671f2d3c18fb55ab555b48bc01f27747a4-0`,
  cache: new InMemoryCache(),
});
