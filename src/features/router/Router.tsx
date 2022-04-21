import { FC } from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";

// Pages
import Vote from "features/vote";

// Components
import { Header } from "common/components/navbar";
import Wallet from "features/wallet";
import { Footer } from "common/components/footer";
import { SigningKeys } from "App";

import useVoteData, { PriceRequestRound } from "common/hooks/useVoteData";
import useOnboard from "common/hooks/useOnboard";
import { useVotingAddress } from "hooks";

interface Props {
  signingKeys: SigningKeys;
  account: string | null;
}

const Router: FC<Props> = ({ signingKeys, account }) => {
  const { signer, address, network } = useOnboard();

  const { votingAddress } = useVotingAddress(address, signer, network);

  const {
    data: voteSummaryData = [] as PriceRequestRound[],
    refetch: refetchVoteSummaryData,
    setNumToQuery,
    loading: pastVoteDataLoading,
  } = useVoteData(votingAddress);

  return (
    <BrowserRouter>
      <div>
        <Header />
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Wallet
          signingKeys={signingKeys}
          refetchVoteSummaryData={refetchVoteSummaryData}
        />
        <Switch>
          <Route path="/">
            <Vote
              signingKeys={signingKeys}
              voteSummaryData={voteSummaryData}
              setNumToQuery={setNumToQuery}
              pastVoteDataLoading={pastVoteDataLoading}
            />
          </Route>
        </Switch>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
