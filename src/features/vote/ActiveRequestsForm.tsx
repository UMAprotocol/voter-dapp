/** @jsxImportSource @emotion/react */
import { FC, useState, useEffect, useCallback } from "react";
import { useForm, useController } from "react-hook-form";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { UnlockedIcon } from "assets/icons";
import { PendingRequest } from "web3/queryVotingContractMethods";
import Button from "common/components/button";
import TextInput from "common/components/text-input";
import Modal from "common/components/modal";
import useModal from "common/hooks/useModal";
import usePrevious from "common/hooks/usePrevious";
import Select from "common/components/select";
interface Props {
  activeRequests: PendingRequest[];
}

type FormData = {
  [key: string]: string;
};

interface Summary {
  identifier: string;
  value: string;
}

const ActiveRequestsForm: FC<Props> = ({ activeRequests }) => {
  const { isOpen, open, close, modalRef } = useModal();
  const generateDefaultValues = useCallback(() => {
    const dv = {} as FormData;
    activeRequests.forEach((el) => {
      dv[el.identifier] = "";
    });

    return dv;
  }, [activeRequests]);

  const { register, handleSubmit, control, watch } = useForm<FormData>({
    defaultValues: generateDefaultValues(),
  });

  const onSubmit = (data: FormData[]) => console.log(data);
  const watchAllFields = watch();

  const [summary, setSummary] = useState<Summary[]>([]);
  const previousSummary = usePrevious(summary);
  const showSummary = useCallback(() => {
    const anyFields = Object.values(watchAllFields).filter((x) => x);
    console.log(anyFields);
    if (anyFields.length) {
      console.log("any fields", anyFields);
      const showSummary = [] as Summary[];
      const identifiers = Object.keys(watchAllFields);
      const values = Object.values(watchAllFields);
      for (let i = 0; i < identifiers.length; i++) {
        if (values[i] !== "") {
          const val = {
            identifier: identifiers[i],
            value: values[i],
          };
          showSummary.push(val);
        }
      }
      return showSummary;
    } else {
      return [];
    }
  }, [watchAllFields]);

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
                    <div>
                      <Select control={control} name={`${el.identifier}`} />

                      {/* <select
                        {...register(`${el.identifier}`)}
                        name={`${el.identifier}`}
                        control={control}
                      >
                        <option value="">--</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select> */}
                    </div>
                  ) : (
                    <TextInput
                      label="Input your vote."
                      control={control}
                      name={`${el.identifier}`}
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
          <Button
            variant={showSummary().length ? "secondary" : "disabled"}
            onClick={() => {
              if (showSummary().length) open();
            }}
          >
            Commit Votes
          </Button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={close} ref={modalRef}>
        <StyledModal>
          <h3 className="header">Ready to commit these votes?</h3>
          {showSummary().length
            ? showSummary().map((el, index) => {
                return (
                  <div key={index}>
                    <div>{el.identifier}</div>
                    <div>{el.value}</div>
                  </div>
                );
              })
            : null}
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
