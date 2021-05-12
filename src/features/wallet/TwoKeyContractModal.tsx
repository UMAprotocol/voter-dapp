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
  const closeForm = useCallback(() => {
    if (showForm) {
      setShowForm(false);
      setValue("");
    } else {
      setSuccess(false);
      setShowForm(true);
    }
  }, [showForm]);

  const submitForm = useCallback(() => {
    if (value.substr(0, 2).toLowerCase() !== "0x")
      return setError("Address must start with 0x");
    if (value.length !== 42) return setError("Address must be 42 characters");
    if (value && network && signer) {
      return createDesignatedVotingContract(value, signer, network).then(
        (res) => {
          console.log("Success dvc?", res);
          closeForm();
          setSuccess(true);
        }
      );
    }
  }, [value, network, signer, closeForm]);
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
                      closeForm();
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
        {success ? <div>Successfully added two-key contract.</div> : null}
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
              <Button onClick={() => closeForm()} variant="primary">
                Cancel
              </Button>
              <Button onClick={() => submitForm()} variant="secondary">
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
