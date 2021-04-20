/** @jsxImportSource @emotion/react */
import { FC, useState, useEffect } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { ethers } from "ethers";
import Modal from "common/components/modal";
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
} from "hooks";

import { queryRetrieveRewards } from "web3/get/queryRetrieveRewards";
import { VoteRevealed } from "web3/get/queryVotesRevealedEvents";
import {
  retrieveRewards,
  PostRetrieveReward,
  PendingRequestRetrieveReward,
} from "web3/post/retrieveRewards";
import { RewardsRetrieved } from "web3/get/queryRewardsRetrievedEvents";

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

  const { votingAddress } = useVotingAddress(address, signer, network);
  const { votingContract } = useVotingContract(signer, isConnected, network);
  const { data: rewardsEvents } = useRewardsRetrievedEvents(
    votingContract,
    votingAddress
  );

  const { data: votesRevealed } = useVotesRevealedEvents(
    votingContract,
    votingAddress
  );

  console.log("data", rewardsEvents);

  useEffect(() => {
    if (votesRevealed.length && votingContract && votingAddress) {
      checkAvailableRewards(votesRevealed, votingAddress, votingContract).then(
        (balance) => {
          setAvailableRewards(balance.toString());
        }
      );
    } else {
      setAvailableRewards(DEFAULT_BALANCE);
    }
  }, [votesRevealed, votingContract, votingAddress]);

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
    <StyledWallet>
      <div className="wrapper">
        <div tw="flex items-stretch items-center">
          <div tw="py-8 pl-5 flex-grow">
            <p className="wallet-title">Voting Wallet</p>
            {isConnected ? (
              <Connected>
                Connected with {onboard?.getState().wallet.name}
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
                    if (votingContract && votesRevealed) {
                      collectRewards(
                        votingContract,
                        votesRevealed,
                        setAvailableRewards
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
        <Modal isOpen={isOpen} onClose={close} ref={modalRef}>
          <StyledModal>
            <h3 className="header">Two Key Voting</h3>
            <p tw="opacity-50 mb-4 text-center">
              You are not currently using a two key voting system. To deploy
              one, provide your cold key address. Click here to learn more about
              the two key voting system.
            </p>
            <div tw="flex items-stretch">
              <Disconnected tw="flex-grow">Not Connected</Disconnected>
              <div className="open-form" tw="flex-grow text-right">
                Add Cold Wallet Address
              </div>
            </div>
          </StyledModal>
        </Modal>
      </div>
    </StyledWallet>
  );
};

async function checkAvailableRewards(
  data: VoteRevealed[],
  address: string,
  contract: ethers.Contract
) {
  const promises = data.map(async (vote) => {
    const rewardAvailable = await queryRetrieveRewards(
      contract,
      address,
      vote.roundId,
      vote.identifier,
      vote.time
    );
    if (rewardAvailable) return parseFloat(rewardAvailable);
  });

  return Promise.all(promises).then((values) => {
    let balance = 0;
    values.map((val) => {
      if (val && val) return (balance += val);
      return false;
    });

    return balance;
  });
}

const StyledWallet = styled.div`
  background-color: #f5f5f5;

  ${tw`max-w-full pt-5 mt-5 pb-1`};
  .wrapper {
    ${tw`max-w-7xl mx-auto py-5 px-8 my-10`}
    background-color: #fff;
  }
  .wallet-title {
    font-weight: 600;
    font-size: 1.5rem;
  }
  .sm-title {
    color: #000;
    margin: 0 0 12px;
    font-weight: 400;
    opacity: 0.5;
  }
  .value-tokens {
    font-size: 1.5rem;
    margin: 0 0 11px;
    span {
      font-weight: 500;
    }
    span:last-child {
      font-weight: 500;
      opacity: 0.3;
    }
  }
  .value-dollars {
    font-size: 0.8rem;
  }
  .connect-btn {
    /* margin-left: 12px; */
    width: 150px;
  }
  .Wallet-collect {
    text-decoration: underline;
    cursor: pointer;
    color: #ff4a4a;
    /* font-size: 0.875rem; */
    margin-left: 4px;
    margin-bottom: 1px;
    line-height: 1rem;
  }
`;

const StyledModal = styled.div`
  max-width: 375px;
  padding: 2rem 1.5rem;
  height: auto;
  position: relative;
  background-color: #fff;
  z-index: 1;
  overflow-y: auto;
  border-radius: 12px;
  margin: 0;
  outline: 0;
  box-sizing: border-box;
  font-family: "Halyard Display";
  border: none;
  .header {
    text-align: center;
    margin-bottom: 1rem;
    font-weight: 600;
    font-size: 1.25rem;
  }
  .header-body {
    border-color: #e5e5e5;
    padding-bottom: 4rem;
  }
  .open-form {
    color: #ff4a4a;
    font-size: 0.8rem;
    line-height: 2rem;
    text-decoration: underline;
  }
`;

const Connected = styled.div`
  font-size: 0.8rem;
  line-height: 2rem;
  flex-basis: 1;
  &::before {
    content: " ";
    display: inline-flex;
    width: 6px;
    height: 6px;
    background-color: #ff4a4a;
    border-radius: 50%;
    margin-right: 10px;
  }
`;

const Disconnected = styled(Connected)`
  &::before {
    background-color: #000;
    opacity: 0.5;
  }
`;

// There are two different colours for the first 4 digits and last 4 digits of the number.
// Hence we need to return an array of strings.
// We want to limit the overall string length to ~8 digits.
function formatWalletBalance(balance: string): string[] {
  if (balance.includes(".")) {
    const strArray: string[] = [];
    const split = balance.split(".");
    const MAX_LENGTH_RIGHT_SIDE = 9 - split[0].length;
    let rightSide = "";
    // Need to confirm is the left whole number isn't a massive amount.
    // If it is, just show 1 decimal.
    if (MAX_LENGTH_RIGHT_SIDE > 0) {
      rightSide = split[1].substr(0, MAX_LENGTH_RIGHT_SIDE);
    } else {
      rightSide = split[1].substr(0, 1);
    }
    strArray.push(`${split[0]}.`);
    strArray.push(rightSide.substr(0, 8));
    return strArray;
  } else {
    const MAX_LENGTH_RIGHT_SIDE = 9 - balance.length;
    let trailingZeros = "";
    for (let i = 0; i < MAX_LENGTH_RIGHT_SIDE; i++) {
      trailingZeros = trailingZeros.concat("0");
    }
    return [`${balance}.`, trailingZeros];
  }
}

function calculateUMATotalValue(price: number, balance: string) {
  const bal = Number(balance);
  return (
    (price * bal)
      .toFixed(2)
      // Add commas
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      .toLocaleString()
  );
}

function collectRewards(
  contract: ethers.Contract,
  data: RewardsRetrieved[],
  setAvailableRewards: Function
) {
  const postData = {} as PostRetrieveReward;
  const pendingRequestData = [] as PendingRequestRetrieveReward[];

  postData.voterAddress = data[0].address;
  postData.roundId = data[0].roundId;
  data.forEach((el) => {
    const pendingRequest = {} as PendingRequestRetrieveReward;
    pendingRequest.ancillaryData = el.ancillaryData ? el.ancillaryData : "0x";
    pendingRequest.identifier = ethers.utils.toUtf8Bytes(el.identifier);
    pendingRequest.time = el.time;
    pendingRequestData.push(pendingRequest);
  });

  postData.pendingRequests = pendingRequestData;
  retrieveRewards(contract, postData).then((tx) => {
    tx.wait(1).then((conf: any) => {
      // This function should collect all available rewards. Set balance to 0.
      // Note: This still needs to be tested for N-1, N-2, ... rounds.
      setAvailableRewards(DEFAULT_BALANCE);
    });
  });
}

export default Wallet;
