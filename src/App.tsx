import { useContext, useEffect } from "react";
import Router from "features/router";
import { QueryClient } from "react-query";
import { OnboardContext } from "common/context/OnboardContext";

interface Props {
  queryClient: QueryClient;
}

function App(props: Props) {
  const { state } = useContext(OnboardContext);
  useEffect(() => {
    if (!state.isConnected) {
      props.queryClient.clear();
    }
  }, [state.isConnected, state.address, props.queryClient]);

  return (
    <div className="App">
      <Router qc={props.queryClient} />
    </div>
  );
}

export default App;
