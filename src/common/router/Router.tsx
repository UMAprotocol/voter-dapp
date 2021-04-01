import { BrowserRouter, Switch, Route } from "react-router-dom";
import ConnectionProvider from "common/context/ConnectionContext";

// Pages
import Vote from "features/vote";

// Components
import Navbar from "common/components/navbar";
import Wallet from "features/wallet";
import Footer from "common/components/footer";

const Router = () => {
  return (
    <BrowserRouter>
      <ConnectionProvider>
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
      </ConnectionProvider>
    </BrowserRouter>
  );
};

export default Router;
