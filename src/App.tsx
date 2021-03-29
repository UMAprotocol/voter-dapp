import Router from "common/router";
import { ApolloProvider } from "@apollo/client";
import { client } from "./common/apollo/client";

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Router />
      </ApolloProvider>
    </div>
  );
}

export default App;
