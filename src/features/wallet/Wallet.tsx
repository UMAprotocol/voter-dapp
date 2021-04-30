/** @jsxImportSource @emotion/react */
import { FC, useState, useEffect } from "react";
import tw from "twin.macro"; // eslint-disable-line
import { ethers } from "ethers";
import useModal from "common/hooks/useModal";
import Button from "common/components/button";
import useOnboard from "common/hooks/useOnboard";
import { Settings } from "assets/icons";
import getUmaBalance from "common/utils/web3/getUmaBalance";
import useUmaPriceData from "common/hooks/useUmaPriceData";

import {
  useVotingAddress,
  useRewardsRetrievedEvents,
  useVotingContract,
  useVotesRevealedEvents,
  useMulticall,
} from "hooks";

import TwoKeyContractModal from "./TwoKeyContractModal";

// Helpers
import formatWalletBalance from "./helpers/formatWalletBalance";
import calculateUMATotalValue from "./helpers/calculateUMATotalValue";
import checkAvailableRewards from "./helpers/checkAvailableRewards";
import collectRewards from "./helpers/collectRewards";

import { Wrapper, Connected, Disconnected } from "./styled/Wallet.styled";
// import ERC20TransferButton from "./helpers/ERC20TransferButton";

interface Props {
  // connect: Connect;
  // disconnect: Disconnect;
}

const DEFAULT_BALANCE = "0";

const Wallet: FC<Props> = () => {
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
  } = useOnboard();

  const { votingAddress, hotAddress } = useVotingAddress(
    address,
    signer,
    network
  );
  const { votingContract, designatedVotingContract } = useVotingContract(
    signer,
    isConnected,
    network,
    votingAddress,
    hotAddress
  );

  // console.log(
  //   "DVC",
  //   designatedVotingContract,
  //   "VC",
  //   votingContract,
  //   "hotAddress",
  //   hotAddress
  // );
  const { data: rewardsEvents } = useRewardsRetrievedEvents(
    votingContract,
    votingAddress
  );

  // console.log("rewards events", rewardsEvents);

  const { multicallContract } = useMulticall(signer, isConnected, network);

  const { data: votesRevealed } = useVotesRevealedEvents(
    votingContract,
    votingAddress
  );

  console.log("revealed", votesRevealed);

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
    if (votingAddress && signer && network) {
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
    if (rewardsEvents.length) {
      let totalRewards = ethers.BigNumber.from("0");
      rewardsEvents.forEach(({ numTokens }) => {
        totalRewards = totalRewards.add(ethers.BigNumber.from(numTokens));
      });

      setTotalUmaCollected(ethers.utils.formatEther(totalRewards.toString()));
    }
  }, [rewardsEvents]);

  return (
    <Wrapper>
      <div className="wrapper">
        <div tw="flex items-stretch items-center">
          <div tw="py-8 pl-5 flex-grow">
            <p className="wallet-title">Voting Wallet</p>
            {isConnected ? (
              <Connected>
                Connected with {onboard?.getState().wallet.name}
                {/* Testing helper */}
                {/* <ERC20TransferButton
                  network={network}
                  signer={signer}
                  hotAddress={hotAddress}
                  votingAddress={votingAddress}
                /> */}
              </Connected>
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
                : "$00.00"}
              USD
            </p>
          </div>
          <div tw="my-5 mx-3 pl-5 flex-grow border-r">
            <p className="sm-title">Total UMA Collected</p>
            <div className="value-tokens">
              <span>{formatWalletBalance(totalUmaCollected)[0]}</span>
              <span>{formatWalletBalance(totalUmaCollected)[1]}</span>
            </div>
            <p className="value-dollars">
              ${" "}
              {totalUmaCollected && umaPrice
                ? calculateUMATotalValue(
                    umaPrice.market_data.current_price.usd,
                    totalUmaCollected
                  )
                : "$00.00"}
              USD
            </p>
          </div>
          <div tw="my-5 mx-3 pl-5 flex-grow">
            <p className="sm-title">
              Available Rewards{" "}
              {availableRewards !== DEFAULT_BALANCE ? (
                <span
                  onClick={() => {
                    if (votingContract && votesRevealed && multicallContract) {
                      collectRewards(
                        votingContract,
                        votesRevealed,
                        setAvailableRewards,
                        multicallContract
                      );
                    }
                  }}
                  className="Wallet-collect"
                >
                  Collect
                </span>
              ) : null}
            </p>
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
                : "$00.00"}
              USD
            </p>
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
    </Wrapper>
  );
};

export default Wallet;
