import { BrowserRouter, Switch, Route } from "react-router-dom";

// Pages
import Vote from "features/vote";

// Components
import Navbar from "common/components/navbar";
import Footer from "common/components/footer";

const Router = () => {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/">
            <Vote />
          </Route>
        </Switch>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
