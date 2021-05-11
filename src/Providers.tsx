import { ApolloProvider } from "@apollo/client";
import { client } from "./common/apollo/client";
import { QueryClient, QueryClientProvider } from "react-query";
import OnboardProvider from "common/context/OnboardContext";

import ErrorProvider from "common/context/ErrorContext";
import App from "./App";

const queryClient = new QueryClient();

function Providers() {
  return (
    <div className="Providers">
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <OnboardProvider>
            <ErrorProvider>
              <App queryClient={queryClient} />
            </ErrorProvider>
          </OnboardProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </div>
  );
}

export default Providers;
