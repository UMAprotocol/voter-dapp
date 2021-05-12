import { useContext, useEffect } from "react";
import Router from "features/router";
import { QueryClient } from "react-query";
import usePrevious from "common/hooks/usePrevious";
import { ToastContainer, toast } from "react-toastify";

// Context
import { ErrorContext } from "common/context/ErrorContext";
import { OnboardContext } from "common/context/OnboardContext";

interface Props {
  queryClient: QueryClient;
}

function App(props: Props) {
  const { state, disconnect, dispatch } = useContext(OnboardContext);
  const { error, removeError } = useContext(ErrorContext);

  useEffect(() => {
    if (error)
      toast.error(error, {
        onClick: () => removeError(),
        closeButton: <span onClick={() => removeError()}>X</span>,
      });
  }, [error, removeError]);

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
      <Router />
      <ToastContainer
        position="top-right"
        autoClose={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
    </div>
  );
}

export default App;
