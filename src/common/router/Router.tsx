import { BrowserRouter, Switch, Route } from "react-router-dom";

import Vote from "features/vote";

const Router = () => {
  return (
    <BrowserRouter>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/">
            <Vote />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default Router;
