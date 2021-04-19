import { useContext, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import OnboardProvider from "common/context/OnboardContext";
import { ToastContainer, toast } from "react-toastify";

// Pages
import Vote from "features/vote";

// Components
import Navbar from "common/components/navbar";
import Wallet from "features/wallet";
import Footer from "common/components/footer";

// Context
import { ErrorContext } from "common/context/ErrorContext";

const Router = () => {
  const { error, removeError } = useContext(ErrorContext);
  useEffect(() => {
    if (error)
      toast.error(error, {
        onClick: () => removeError(),
        closeButton: <span onClick={() => removeError()}>X</span>,
      });
  }, [error, removeError]);

  return (
    <BrowserRouter>
      <OnboardProvider>
        <div>
          <Navbar />
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Wallet />
          <Switch>
            <Route path="/">
              <Vote />
            </Route>
          </Switch>
        </div>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
        />
      </OnboardProvider>
    </BrowserRouter>
  );
};

export default Router;
