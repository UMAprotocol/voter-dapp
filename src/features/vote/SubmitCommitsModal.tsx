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
import { SubmitModalState, Summary, FormData } from "./CommitPhase";
import { UnlockedIcon, LockedIconCommitted } from "assets/icons";
import {
  FieldValues,
  SubmitHandler,
  SubmitErrorHandler,
  UseFormReset,
} from "react-hook-form";

interface Props {
  isOpen: boolean;
  close: () => void;
  ref: (node: HTMLElement | null) => void;
  modalState: SubmitModalState;
  setModalState: Dispatch<SetStateAction<SubmitModalState>>;
  submitErrorMessage: string;
  setSubmitErrorMessage: Dispatch<SetStateAction<string>>;
  showModalSummary: () => Summary[];
  // From react-hook-form
  reset: UseFormReset<FormData>;
  // From react hook form.
  handleSubmit: <TSubmitFieldValues extends FieldValues = FormData>(
    onValid: SubmitHandler<TSubmitFieldValues>,
    onInvalid?: SubmitErrorHandler<FormData>
  ) => (e?: BaseSyntheticEvent) => Promise<void>;
  onSubmit: (data: FormData) => void;
}

const _SubmitCommitsModal: ForwardRefRenderFunction<
  HTMLElement,
  PropsWithChildren<Props>
> = (
  {
    isOpen,
    close,
    modalState,
    showModalSummary,
    setModalState,
    reset,
    handleSubmit,
    onSubmit,
    submitErrorMessage,
    setSubmitErrorMessage,
  },
  externalRef
) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          close();
          setModalState("init");
          setSubmitErrorMessage("");
        }}
        ref={externalRef}
      >
        <ModalWrapper>
          <div className="icon-wrapper">
            {modalState === "pending" ? (
              <div className="modal__ico modal__ico-animate">
                <UnlockedIcon className="unlocked-icon" />

                <div className="modal__ico-container">
                  <div className="modal__ico-halfclip">
                    <div className="modal__ico-halfcircle modal__ico-clipped"></div>
                  </div>

                  <div className="modal__ico-halfcircle modal__ico-fixed"></div>
                </div>
              </div>
            ) : modalState === "success" ? (
              <LockedIconCommitted className="unlocked-icon" />
            ) : (
              <UnlockedIcon className="unlocked-icon" />
            )}
          </div>

          {modalState === "pending" ? (
            <h3 className="header">Committing Votes...</h3>
          ) : modalState === "success" ? (
            <h3 className="header">Votes successfully committed</h3>
          ) : (
            <>
              <h3 className="header">Ready to commit these votes?</h3>
              {submitErrorMessage && (
                <SubmitErrorMessage>{submitErrorMessage}</SubmitErrorMessage>
              )}
            </>
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
          <div
            className={`button-wrapper ${
              modalState === "pending" ? "pending" : ""
            }`}
          >
            {modalState === "init" ||
            modalState === "pending" ||
            modalState === "error" ? (
              <>
                <Button
                  onClick={() => {
                    close();
                    setModalState("init");
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
              </>
            ) : (
              <Button
                onClick={() => {
                  // close modal and reset form values.
                  close();
                  reset();
                  setModalState("init");
                  setSubmitErrorMessage("");
                }}
                variant="secondary"
              >
                Done
              </Button>
            )}
          </div>
        </ModalWrapper>
      </Modal>
    </>
  );
};

const SubmitCommitsModal = forwardRef(_SubmitCommitsModal);
SubmitCommitsModal.displayName = "SubmitCommitsModal";

export default SubmitCommitsModal;
