import Router from "features/router";
import { ApolloProvider } from "@apollo/client";
import { client } from "./common/apollo/client";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
