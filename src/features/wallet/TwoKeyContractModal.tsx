/** @jsxImportSource @emotion/react */
import { ForwardRefRenderFunction, PropsWithChildren, forwardRef } from "react";
import tw from "twin.macro"; // eslint-disable-line
import Modal from "common/components/modal";
import { ModalWrapper } from "./styled/TwoKeyContractModal.styled";
import { Disconnected, Connected } from "./styled/Wallet.styled";
import createDesignatedVotingContract from "./helpers/createDesignatedVotingContract";
import { ethers } from "ethers";
interface Props {
  isOpen: boolean;
  close: () => void;
  ref: (node: HTMLElement | null) => void;
  hotAddress: string | null;
  votingAddress: string | null;
  isConnected: boolean;
  network: ethers.providers.Network | null;
  signer: ethers.Signer | null;
}

const _TwoKeyContractModal: ForwardRefRenderFunction<
  HTMLElement,
  PropsWithChildren<Props>
> = (
  { isOpen, close, hotAddress, votingAddress, isConnected, network, signer },
  externalRef
) => {
  return (
    <Modal isOpen={isOpen} onClose={close} ref={externalRef}>
      <ModalWrapper>
        <h3 className="header">Two Key Voting</h3>
        {!isConnected ? (
          <p tw="opacity-50 mb-4 text-center">
            Connect your wallet to start this process.
          </p>
        ) : (
          <>
            <p tw="opacity-50 mb-4 text-center">
              {!hotAddress
                ? `You are not currently using a two key voting system. To deploy one,
          provide your cold key address. Click here to learn more about the two
          key voting system.`
                : `Your hot wallet address is: ${hotAddress} and your cold wallet address is ${votingAddress}`}
            </p>

            <div tw="flex items-stretch">
              {!hotAddress ? (
                <>
                  <Disconnected tw="flex-grow">Not Connected</Disconnected>
                  <div
                    onClick={() => {
                      if (votingAddress && network && signer) {
                        createDesignatedVotingContract(
                          votingAddress,
                          signer,
                          network
                        ).then((res) => {
                          console.log("Success dvc?", res);
                        });
                      }
                    }}
                    className="open-form"
                    tw="flex-grow text-right"
                  >
                    Add Cold Wallet Address
                  </div>
                </>
              ) : (
                <Connected>Connected</Connected>
              )}
            </div>
          </>
        )}
      </ModalWrapper>
    </Modal>
  );
};

const TwoKeyContractModal = forwardRef(_TwoKeyContractModal);
TwoKeyContractModal.displayName = "TwoKeyContractModal";

export default TwoKeyContractModal;
