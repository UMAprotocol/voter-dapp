/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from "react";
import tw, { styled } from "twin.macro";

// Components
import ActiveRequests from "./ActiveRequests";
import PastRequests from "./PastRequests";
// import { PriceRound } from "web3/queryVotingContractEvents";
// import { usePriceRoundEvents } from "hooks";
import useVoteData from "common/hooks/useVoteData";
import { OnboardContext } from "common/context/OnboardContext";
import { useVotingAddress, useVotingContract } from "hooks";
// import { isActiveRequest } from "./helpers";
import EthCrypto from "eth-crypto";
import web3 from "web3";

function recoverPublicKey(privateKey: string) {
  // The "0x" is added to make the public key web3 friendly.
  // return "0x" + EthCrypto.publicKeyByPrivateKey(privateKey);
  return EthCrypto.publicKeyByPrivateKey(privateKey);
}

function deriveKeyPair(signature: string) {
  // const privateKey = web3.utils.soliditySha3(signature);
  const privateKey = web3.utils.keccak256(signature);
  if (privateKey) {
    const publicKey = recoverPublicKey(privateKey);
    return { publicKey, privateKey };
  } else {
    return {} as { publicKey: string; privateKey: string };
  }
}

const Vote = () => {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const { state } = useContext(OnboardContext);
  // const [activeRequests, setActiveRequests] = useState<PriceRound[]>([]);

  // This is determined before a user connects.
  // const { data: priceRoundsEvents } = usePriceRoundEvents();

  const { data: priceRequestRounds } = useVoteData();
  const { votingAddress } = useVotingAddress(
    state.address,
    state.signer,
    state.network
  );

  const { votingContract } = useVotingContract(
    state.signer,
    state.isConnected,
    state.network
  );

  if (state.onboard) {
    console.log(state.onboard, state.onboard.getState());
  }

  useEffect(() => {
    if (state.signer) {
      const message = "Login to UMA Voter dApp";
      state.signer
        .signMessage(message)
        .then((msg) => {
          // This does derive a public key, but maybe the wrong one.
          const derivedPubKey = EthCrypto.recoverPublicKey(
            msg, // signature
            EthCrypto.hash.keccak256(message) // message hash
          );
          const { publicKey, privateKey } = deriveKeyPair(msg);
          console.log(
            "publicKey",
            publicKey,
            publicKey.length,
            "private Key",
            privateKey
          );
          setPrivateKey(privateKey);
          // setPublicKey(derivedPubKey);
          setPublicKey(publicKey);
        })
        .catch((err) => {
          console.log("Sign failed");
        });
    }
  }, [state.signer]);

  // // Once priceRounds are pulled from contract, filter them into requests.
  // useEffect(() => {
  //   if (priceRoundsEvents.length) {
  //     const ar = priceRoundsEvents.filter(isActiveRequest);
  //     setActiveRequests(ar);
  //   }
  // }, [priceRoundsEvents]);

  return (
    <StyledVote>
      <ActiveRequests
        // activeRequests={activeRequests}
        publicKey={publicKey}
        privateKey={privateKey}
      />
      <PastRequests
        priceRounds={priceRequestRounds}
        address={votingAddress}
        contract={votingContract}
      />
    </StyledVote>
  );
};

const StyledVote = styled.div`
  background-color: #f5f5f5;
  ${tw`max-w-full pt-5 pb-1`};
  font-family: "Halyard Display";
`;

export default Vote;
