import Router from "features/router";
import { ApolloProvider } from "@apollo/client";
import { client } from "./common/apollo/client";
import { QueryClient, QueryClientProvider } from "react-query";
import OnboardProvider from "common/context/OnboardContext";

import ErrorProvider from "common/context/ErrorContext";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <OnboardProvider>
            <ErrorProvider>
              <Router qc={queryClient} />
            </ErrorProvider>
          </OnboardProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
