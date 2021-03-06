import { FC } from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";

// Pages
import Vote from "features/vote";

// Components
import Navbar from "common/components/navbar";
import Wallet from "features/wallet";
import Footer from "common/components/footer";
import { SigningKeys } from "App";

import useVoteData, { PriceRequestRound } from "common/hooks/useVoteData";

interface Props {
  signingKeys: SigningKeys;
}

const Router: FC<Props> = ({ signingKeys }) => {
  const {
    data: voteSummaryData = [] as PriceRequestRound[],
    refetch: refetchVoteSummaryData,
  } = useVoteData();

  return (
    <BrowserRouter>
      <div>
        <Navbar />
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Wallet
          signingKeys={signingKeys}
          refetchVoteSummaryData={refetchVoteSummaryData}
        />
        <Switch>
          <Route path="/">
            <Vote signingKeys={signingKeys} voteSummaryData={voteSummaryData} />
          </Route>
        </Switch>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
