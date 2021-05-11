import { useContext, useEffect } from "react";
import Router from "features/router";
import { QueryClient } from "react-query";
import { OnboardContext } from "common/context/OnboardContext";
import usePrevious from "common/hooks/usePrevious";

interface Props {
  queryClient: QueryClient;
}

function App(props: Props) {
  const { state, disconnect, dispatch } = useContext(OnboardContext);

  useEffect(() => {
    if (!state.isConnected) {
      props.queryClient.clear();
    }
  }, [state.isConnected, state.address, props.queryClient]);

  // Disconnect user if they are looged in and they switch accounts in MM
  const previousAddress = usePrevious(state.address);
  useEffect(() => {
    if (previousAddress && state.address && previousAddress !== state.address) {
      disconnect(dispatch, state.onboard);
    }
  }, [state.address, previousAddress, dispatch, state.onboard, disconnect]);

  return (
    <div className="App">
      <Router qc={props.queryClient} />
    </div>
  );
}

export default App;
