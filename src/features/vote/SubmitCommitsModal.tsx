import {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  Dispatch,
  SetStateAction,
  BaseSyntheticEvent,
} from "react";

import Modal from "common/components/modal";
import Button from "common/components/button";
import {
  ModalWrapper,
  SubmitErrorMessage,
} from "./styled/SubmitCommitsModal.styled";
import { Summary, FormData } from "./CommitPhase";
import {
  FieldValues,
  SubmitHandler,
  SubmitErrorHandler,
} from "react-hook-form";

interface Props {
  isOpen: boolean;
  close: () => void;
  ref: (node: HTMLElement | null) => void;
  submitErrorMessage: string;
  setSubmitErrorMessage: Dispatch<SetStateAction<string>>;
  showModalSummary: () => Summary[];
  // From react-hook-form
  // From react hook form.
  handleSubmit: <TSubmitFieldValues extends FieldValues = FormData>(
    onValid: SubmitHandler<TSubmitFieldValues>,
    onInvalid?: SubmitErrorHandler<FormData>
  ) => (e?: BaseSyntheticEvent) => Promise<void>;
  onSubmit: (data: FormData) => void;
  votingAddress: string | null;
  hotAddress: string | null;
}

const _SubmitCommitsModal: ForwardRefRenderFunction<
  HTMLElement,
  PropsWithChildren<Props>
> = (
  {
    isOpen,
    close,
    showModalSummary,
    handleSubmit,
    onSubmit,
    submitErrorMessage,
    setSubmitErrorMessage,
    votingAddress,
    hotAddress,
  },
  externalRef
) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          close();
          setSubmitErrorMessage("");
        }}
        ref={externalRef}
      >
        <ModalWrapper>
          <h3 className="header">Ready to commit these votes?</h3>
          {hotAddress ? (
            <>
              <p>Designated Voting Contract Address: {votingAddress}</p>
              <p>Hot Wallet Address: {hotAddress}</p>
            </>
          ) : (
            <p>Voting Address: {votingAddress}</p>
          )}
          {submitErrorMessage && (
            <SubmitErrorMessage>{submitErrorMessage}</SubmitErrorMessage>
          )}

          {showModalSummary().length
            ? showModalSummary().map((el, index) => {
                return (
                  <div className="vote-wrapper" key={index}>
                    <div>{el.identifier}</div>
                    <div>{el.value}</div>
                  </div>
                );
              })
            : null}
          <div className={`button-wrapper`}>
            <Button
              onClick={() => {
                close();
                setSubmitErrorMessage("");
              }}
              variant="primary"
            >
              Not Yet
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              variant="secondary"
            >
              I'm Ready
            </Button>
          </div>
        </ModalWrapper>
      </Modal>
    </>
  );
};

const SubmitCommitsModal = forwardRef(_SubmitCommitsModal);
SubmitCommitsModal.displayName = "SubmitCommitsModal";

export default SubmitCommitsModal;
