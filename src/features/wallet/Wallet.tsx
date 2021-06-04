/** @jsxImportSource @emotion/react */
import { FC, useState, useEffect, useContext } from "react";
import tw from "twin.macro"; // eslint-disable-line
import { ethers } from "ethers";
import web3 from "web3";
import useModal from "common/hooks/useModal";
import Button from "common/components/button";
import useOnboard from "common/hooks/useOnboard";
import { Settings } from "assets/icons";
import getUmaBalance from "common/utils/web3/getUmaBalance";
import useUmaPriceData from "common/hooks/useUmaPriceData";
import usePrevious from "common/hooks/usePrevious";
import ReactTooltip from "react-tooltip";

import {
  useVotingAddress,
  useRewardsRetrievedEvents,
  useVotingContract,
  useVotesRevealedEvents,
  useMulticall,
} from "hooks";

import TwoKeyContractModal from "./TwoKeyContractModal";
import { ErrorContext } from "common/context/ErrorContext";

// Helpers
import formatWalletBalance from "./helpers/formatWalletBalance";
import calculateUMATotalValue from "./helpers/calculateUMATotalValue";
import checkAvailableRewards from "./helpers/checkAvailableRewards";
import collectRewards from "./helpers/collectRewards";
import shortenAddress from "./helpers/shortenAddress";
import { RewardsRetrieved } from "web3/get/queryRewardsRetrievedEvents";
import { VoteRevealed } from "web3/get/queryVotesRevealedEvents";
import {
  Wrapper,
  Connected,
  Disconnected,
  Reconnect,
  VotingAddress,
} from "./styled/Wallet.styled";
// import ERC20TransferButton from "./helpers/ERC20TransferButton";
import { SigningKeys } from "App";
import currentSigningMessage from "common/currentSigningMessage";
import { useCurrentRoundId } from "hooks";

interface Props {
  signingKeys: SigningKeys;
}

const DEFAULT_BALANCE = "0";

const Wallet: FC<Props> = ({ signingKeys }) => {
  const [umaBalance, setUmaBalance] = useState(DEFAULT_BALANCE);
  const [totalUmaCollected, setTotalUmaCollected] = useState(DEFAULT_BALANCE);
  const [availableRewards, setAvailableRewards] = useState(DEFAULT_BALANCE);
  const { data: umaPrice } = useUmaPriceData();
  const { isOpen, open, close, modalRef } = useModal();
  const {
    initOnboard,
    setInitOnboard,
    isConnected,
    onboard,
    disconnect,
    signer,
    address,
    network,
    notify,
  } = useOnboard();

  const { addError } = useContext(ErrorContext);

  const prevTotalCollected = usePrevious(totalUmaCollected);
  const prevAvailableReweards = usePrevious(availableRewards);

  const { votingAddress, hotAddress } = useVotingAddress(
    address,
    signer,
    network
  );
  const { data: roundId } = useCurrentRoundId();

  const message = currentSigningMessage(Number(roundId));
  const hashedMessage = web3.utils.utf8ToHex(message);

  const signingPK =
    hotAddress &&
    signingKeys[hashedMessage] &&
    signingKeys[hashedMessage][hotAddress]
      ? signingKeys[hashedMessage][hotAddress].privateKey
      : votingAddress &&
        signingKeys[hashedMessage] &&
        signingKeys[hashedMessage][votingAddress]
      ? signingKeys[hashedMessage][votingAddress].privateKey
      : "";

  const { votingContract, designatedVotingContract } = useVotingContract(
    signer,
    isConnected,
    network,
    votingAddress,
    hotAddress
  );

  const { data: rewardsEvents = [] as RewardsRetrieved[] } =
    useRewardsRetrievedEvents(votingContract, votingAddress);

  const { multicallContract } = useMulticall(signer, isConnected, network);

  const { data: votesRevealed = [] as VoteRevealed[] } = useVotesRevealedEvents(
    votingContract,
    votingAddress
  );

  useEffect(() => {
    if (votesRevealed.length && votingContract && votingAddress) {
      checkAvailableRewards(votesRevealed, votingAddress, votingContract).then(
        (balance) => {
          setAvailableRewards(balance ? balance.toString() : DEFAULT_BALANCE);
        }
      );
    } else {
      setAvailableRewards(DEFAULT_BALANCE);
    }
  }, [votesRevealed, votingContract, votingAddress, designatedVotingContract]);

  useEffect(() => {
    // When Address changes in MM, balance will change, as the address in context is changing from Onboard.
    if (votingAddress && signer && network && network.chainId) {
      getUmaBalance(votingAddress, signer, network.chainId.toString()).then(
        (balance) => {
          setUmaBalance(balance);
        }
      );
    }
    if (!isConnected) {
      setUmaBalance(DEFAULT_BALANCE);
      setTotalUmaCollected(DEFAULT_BALANCE);
      setAvailableRewards(DEFAULT_BALANCE);
    }
  }, [signer, votingAddress, network, isConnected]);

  // Iterate over reward events to determine total UMA collected from voting.
  useEffect(() => {
    if (rewardsEvents.length && isConnected) {
      let totalRewards = ethers.BigNumber.from("0");
      rewardsEvents.forEach(({ numTokens }) => {
        totalRewards = totalRewards.add(ethers.BigNumber.from(numTokens));
      });

      setTotalUmaCollected(ethers.utils.formatEther(totalRewards.toString()));
    } else {
      setTotalUmaCollected(DEFAULT_BALANCE);
    }
  }, [rewardsEvents, isConnected]);

  // recheck balance if total collected or available rewards changes.
  useEffect(() => {
    if (network && signer && votingAddress) {
      if (
        prevTotalCollected !== totalUmaCollected ||
        prevAvailableReweards !== availableRewards
      ) {
        getUmaBalance(votingAddress, signer, network.chainId.toString()).then(
          (balance) => {
            setUmaBalance(balance);
          }
        );
      }
    }
  }, [
    votingAddress,
    prevTotalCollected,
    totalUmaCollected,
    prevAvailableReweards,
    availableRewards,
    network,
    signer,
  ]);

  // Note: because there is dynamic content, this will rebuild the tooltip for addressing the conditional
  // elements on the page. See ReactTooltip docs.
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <Wrapper>
      <div className="wrapper">
        <div tw="flex items-stretch items-center">
          <div tw="py-8 pl-5 flex-grow">
            <div className="wallet-title">Voting Wallet</div>
            {isConnected && votingAddress ? (
              <>
                <VotingAddress>
                  {hotAddress ? "Vote: " : null}{" "}
                  <span data-for="wallet" data-tip={`${votingAddress}`}>
                    {shortenAddress(votingAddress)}
                  </span>
                </VotingAddress>
                {hotAddress ? (
                  <VotingAddress data-for="wallet" data-tip={`${hotAddress}`}>
                    Hot: {shortenAddress(hotAddress)}
                  </VotingAddress>
                ) : null}
                {signingPK ? (
                  <Connected>
                    Connected with {onboard?.getState().wallet?.name}{" "}
                  </Connected>
                ) : (
                  <Reconnect>
                    {" "}
                    Account needs to sign message. Reconnect if sign cancelled.
                  </Reconnect>
                )}
              </>
            ) : (
              <Disconnected>Not Connected</Disconnected>
            )}

            {!isConnected ? (
              <Button
                className="connect-btn"
                onClick={() => {
                  if (!initOnboard) setInitOnboard(true);
                }}
                variant="secondary"
              >
                Connect Wallet
              </Button>
            ) : (
              <Button
                className="connect-btn"
                onClick={() => {
                  disconnect();
                }}
                variant="secondary"
              >
                Disconnect
              </Button>
            )}
          </div>

          <div tw="my-5 mx-3 flex-grow border-r">
            <p className="sm-title">UMA Balance</p>
            {isConnected ? (
              <>
                <div className="value-tokens">
                  <span>{formatWalletBalance(umaBalance)[0]}</span>
                  <span>{formatWalletBalance(umaBalance)[1]}</span>
                </div>
                <p className="value-dollars">
                  $
                  {umaBalance && umaPrice
                    ? calculateUMATotalValue(
                        umaPrice.market_data.current_price.usd,
                        umaBalance
                      )
                    : "00.00"}{" "}
                  USD
                </p>
              </>
            ) : (
              <div>--</div>
            )}
          </div>
          <div tw="my-5 mx-3 pl-5 flex-grow border-r">
            <p className="sm-title">Total UMA Collected</p>
            {isConnected ? (
              <>
                <div className="value-tokens">
                  <span>{formatWalletBalance(totalUmaCollected)[0]}</span>
                  <span>{formatWalletBalance(totalUmaCollected)[1]}</span>
                </div>
                <p className="value-dollars">
                  $
                  {totalUmaCollected && umaPrice
                    ? calculateUMATotalValue(
                        umaPrice.market_data.current_price.usd,
                        totalUmaCollected
                      )
                    : "00.00"}{" "}
                  USD
                </p>
              </>
            ) : (
              <div>--</div>
            )}
          </div>
          <div tw="my-5 mx-3 pl-5 flex-grow">
            <p className="sm-title">
              Available Rewards{" "}
              {availableRewards !== DEFAULT_BALANCE && isConnected ? (
                <span
                  onClick={() => {
                    if (votingContract && votesRevealed && multicallContract) {
                      const unclaimedRewards = votesRevealed.filter(
                        (x) =>
                          !rewardsEvents.some(
                            (y) =>
                              x.identifier === y.identifier &&
                              x.roundId === y.roundId &&
                              x.ancillaryData === y.ancillaryData
                          )
                      );

                      return (
                        collectRewards(
                          votingContract,
                          unclaimedRewards,
                          multicallContract
                        )
                          // wait for at least 1 block conf.
                          .then((tx) => {
                            if (tx) {
                              if (notify) notify.hash(tx.hash);

                              tx.wait(1)
                                .then((conf: any) => {
                                  setAvailableRewards(DEFAULT_BALANCE);
                                })
                                .catch((err: any) => addError(err));
                            }
                          })
                      );
                    }
                  }}
                  className="Wallet-collect"
                >
                  Collect
                </span>
              ) : null}
            </p>
            {isConnected ? (
              <>
                <div className="value-tokens">
                  <span>{formatWalletBalance(availableRewards)[0]}</span>
                  <span>{formatWalletBalance(availableRewards)[1]}</span>
                </div>
                <p className="value-dollars">
                  $
                  {availableRewards && umaPrice
                    ? calculateUMATotalValue(
                        umaPrice.market_data.current_price.usd,
                        availableRewards
                      )
                    : "00.00"}{" "}
                  USD
                </p>
              </>
            ) : (
              <div>--</div>
            )}
          </div>
          <div tw="py-10 pl-5 ml-auto flex-none">
            <Settings onClick={() => open()} tw="cursor-pointer" />
          </div>
        </div>
        <TwoKeyContractModal
          isOpen={isOpen}
          close={close}
          ref={modalRef}
          hotAddress={hotAddress}
          votingAddress={votingAddress}
          isConnected={isConnected}
          network={network}
          signer={signer}
        />
      </div>
      <ReactTooltip id="wallet" place="top" type="dark" effect="float" />
    </Wrapper>
  );
};

export default Wallet;
