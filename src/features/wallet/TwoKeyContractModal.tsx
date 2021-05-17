/** @jsxImportSource @emotion/react */
import {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  useState,
  useCallback,
} from "react";
import tw from "twin.macro"; // eslint-disable-line
import Modal from "common/components/modal";
import {
  ModalWrapper,
  ButtonWrapper,
  FormWrapper,
  Error,
  Anchor,
} from "./styled/TwoKeyContractModal.styled";
import { Disconnected, Connected } from "./styled/Wallet.styled";
import createDesignatedVotingContract from "./helpers/createDesignatedVotingContract";
import { ethers } from "ethers";
import Button from "common/components/button";
import { StyledInput } from "common/components/text-input/TextInput";

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
  const [showForm, setShowForm] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const toggleForm = useCallback(() => {
    if (showForm) {
      setShowForm(false);
      setValue("");
    } else {
      setSuccess(false);
      setShowForm(true);
    }
  }, [showForm]);

  const submitForm = useCallback(() => {
    // We don't use ethers.utils.isAddress because it allows for a 40 char address
    // that doesn't include the prefix -- it will return true, which is not desired behaviour.
    if (value.substr(0, 2).toLowerCase() !== "0x")
      return setError("Address must start with 0x");
    if (value.length !== 42) return setError("Address must be 42 characters");

    if (value && network && signer) {
      return createDesignatedVotingContract(value, signer, network)
        .then((res) => {
          toggleForm();
          setSuccess(true);
        })
        .catch((err) => {
          console.log("err in two key contract creation", err);
        });
    }
  }, [value, network, signer, toggleForm]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        close();
        setSuccess(false);
      }}
      ref={externalRef}
    >
      <ModalWrapper>
        <h3 className="header">Two Key Voting (optional)</h3>
        {!isConnected ? (
          <p tw="opacity-50 mb-4 text-center">
            Connect your wallet to start this process.
          </p>
        ) : (
          <>
            <p tw="opacity-50 mb-4 text-center">
              {!hotAddress ? (
                <div>
                  You are not currently using a two key voting system.
                  <br />
                  <br />
                  If would like to vote with a wallet on behalf of UMA tokens
                  you hold in another wallet (e.g. a hardware wallet) you have
                  the option to deploy a 2key contract.
                  <br />
                  <br />
                  Click{" "}
                  <Anchor
                    href="https://docs.umaproject.org/uma-tokenholders/voting-2key"
                    rel="noreferrer"
                    target="_blank"
                  >
                    here
                  </Anchor>{" "}
                  to learn more about the two key voting contract.
                </div>
              ) : (
                <div>
                  Your hot wallet address is: ${hotAddress} and your
                  DesignatedVoting wallet address is ${votingAddress}
                </div>
              )}
            </p>

            <div tw="flex items-stretch">
              {!hotAddress ? (
                <>
                  <Disconnected tw="flex-grow">Not Connected</Disconnected>
                  <div
                    onClick={toggleForm}
                    className="open-form"
                    tw="flex-grow text-right"
                  >
                    {showForm ? "Remove" : "Add Cold Wallet Address"}
                  </div>
                </>
              ) : (
                <Connected>Connected</Connected>
              )}
            </div>
          </>
        )}
        {success && (
          <div>
            Successfully added two-key contract. Please reconnect to use voting
            app.
          </div>
        )}
        {showForm ? (
          <FormWrapper>
            <StyledInput>
              <label>Cold Wallet Address</label>
              <div>
                <input
                  placeholder="0x123..."
                  type="text"
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value);
                    setError("");
                  }}
                />
                {error ? <Error>{error}</Error> : null}
              </div>
            </StyledInput>

            <ButtonWrapper>
              <Button onClick={toggleForm} variant="primary">
                Cancel
              </Button>
              <Button onClick={submitForm} variant="secondary">
                Save
              </Button>
            </ButtonWrapper>
          </FormWrapper>
        ) : null}
      </ModalWrapper>
    </Modal>
  );
};

const TwoKeyContractModal = forwardRef(_TwoKeyContractModal);
TwoKeyContractModal.displayName = "TwoKeyContractModal";

export default TwoKeyContractModal;
