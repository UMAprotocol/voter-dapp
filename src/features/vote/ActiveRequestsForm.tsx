/** @jsxImportSource @emotion/react */
import { FC } from "react";
import { useForm, Controller } from "react-hook-form";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { UnlockedIcon } from "assets/icons";
import { PendingRequest } from "web3/queryVotingContractMethods";
import Button from "common/components/button";
import TextInput from "common/components/text-input";
import Modal from "common/components/modal";
import useModal from "common/hooks/useModal";

interface Props {
  activeRequests: PendingRequest[];
}

type FormData = {
  [key: string]: string;
};

const ActiveRequestsForm: FC<Props> = ({ activeRequests }) => {
  const { isOpen, open, close, modalRef } = useModal();
  const { handleSubmit, control, watch } = useForm<FormData>();
  const onSubmit = (data: FormData[]) => console.log(data);
  const watchAllFields = watch();
  console.log("formstate", watchAllFields);
  return (
    <StyledActiveRequestsForm onSubmit={handleSubmit(onSubmit)}>
      <table className="table">
        <thead>
          <tr>
            <th>Requested Vote</th>
            <th>Proposal Detail</th>
            <th>Description</th>
            <th>Your Vote</th>
            <th>Vote Status</th>
          </tr>
        </thead>
        <tbody>
          {activeRequests.map((el, index) => {
            return (
              <tr key={index}>
                <td>
                  <div className="identifier">{el.identifier}</div>
                </td>
                <td>{el.ancillaryData}</td>
                <td>
                  <div className="description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Curabitur sed eleifend erat. Duis in ante nisi. Donec ut
                    nibh id justo faucibus fermentum id id ex. Mauris
                    sollicitudin consequat neque.
                  </div>
                </td>
                <td>
                  {el.identifier.includes("Admin") ? (
                    <div>Select stub</div>
                  ) : (
                    <TextInput
                      label="Input your vote."
                      control={control}
                      name={`${el.identifier}-${el.time}-vote-input-${index}`}
                      placeholder="0.000"
                      variant="currency"
                    />
                  )}
                </td>
                <td>
                  <div>
                    <UnlockedIcon />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="end-row">
        <div className="end-row-item">
          Need to enable two key voting? Click here.
        </div>
        <div className="end-row-item">
          <Button variant="secondary" onClick={() => open()}>
            Commit Votes
          </Button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={close} ref={modalRef}>
        <StyledModal>
          <h3 className="header">Reader to commit these votes?</h3>
        </StyledModal>
      </Modal>
    </StyledActiveRequestsForm>
  );
};

const StyledActiveRequestsForm = styled.form`
  .table {
    ${tw`table-auto`};
    width: 100%;
    max-width: 1250px;
    margin: 0 auto;
    border-collapse: separate;
    border-spacing: 0 15px;

    thead {
      tr {
        text-align: left;
        margin-bottom: 2rem;
      }
      th:last-child {
        text-align: center;
      }
    }

    tbody {
      td {
        div {
          display: flex;
          align-items: center;
        }
        .description {
          max-width: 500px;
        }
      }
      td:first-of-type {
        /* div {

      }
      max-width: 150px; */
      }

      td:last-child {
        svg {
          margin: 0 auto;
        }
      }
    }
  }
  .end-row {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    .end-row-item {
    }
  }
`;

const StyledInput = styled.div`
  display: flex;
  flex-direction: column;
  .label {
    width: 100%;
    padding-left: 20px;
    margin-bottom: 1rem;
    font-weight: 400;
    font-size: 14px;
  }
  input {
    min-height: 25px;
    min-width: 150px;
    width: 100%;
    background-color: #f4f5f4;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
    &:focus {
      background-color: #fff;
      color: #ff4d4c;
      outline-color: #ff4d4c;
    }
  }
  .dollar-sign {
    position: absolute;
    margin-left: 8px;
    margin-bottom: 32px;
    pointer-events: none;
    /* color: #ff4d4c; */
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

export default ActiveRequestsForm;
