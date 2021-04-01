import { BrowserRouter, Switch, Route } from "react-router-dom";
import OnboardProvider from "common/context/OnboardContext";

// Pages
import Vote from "features/vote";

// Components
import Navbar from "common/components/navbar";
import Wallet from "features/wallet";
import Footer from "common/components/footer";

const Router = () => {
  return (
    <BrowserRouter>
      <OnboardProvider>
        <div>
          <Navbar />
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Wallet />
          <Switch>
            <Route path="/past-requests"></Route>
            <Route path="/">
              <Vote />
            </Route>
          </Switch>
        </div>
        <Footer />
      </OnboardProvider>
    </BrowserRouter>
  );
};

export default Router;
