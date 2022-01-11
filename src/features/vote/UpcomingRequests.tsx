/** @jsxImportSource @emotion/react */
import { FC, useState } from "react";
import { PriceRequestAdded } from "common/web3/get/queryPriceRequestAddedEvents";
import { Wrapper } from "./styled/UpcomingRequests.styled";
import {
  Description,
  Table,
  FullDate,
  DescriptionWrapper,
} from "./styled/ActiveRequests.styled";
import useModal from "common/hooks/useModal";
import useUpcomingRequests from "./hooks/useUpcomingRequests";
import DescriptionModal from "./DescriptionModal";

export interface FormattedRequest {
  proposal: string;
  description: string;
  timestamp: string;
  unix: string;
}

interface Props {
  upcomingRequests: PriceRequestAdded[];
}
const UpcomingRequests: FC<Props> = ({ upcomingRequests }) => {
  const [description, setDescription] = useState("");
  const [proposal, setProposal] = useState("");

  const { isOpen, open, close, modalRef } = useModal();

  const { tableValues } = useUpcomingRequests(upcomingRequests);

  return (
    <Wrapper className="UpcomingRequests">
      <div className="requests-header-row">
        <div>
          <p className="requests-title-lg title">Upcoming Requests</p>
        </div>
      </div>
      <Table className="requests-table">
        <thead>
          <tr>
            <th>Proposal</th>
            <th>Description</th>
            <th>UNIX Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {tableValues.map((el, index) => {
            return (
              <tr key={index}>
                <td>
                  <div className="identifier">{el.proposal}</div>
                </td>
                <td>
                  <DescriptionWrapper className="description">
                    {el.description && el.description.split(" ").length > 16 ? (
                      <Description>
                        {el.description.split(" ").slice(0, 16).join(" ")}...{" "}
                        <span
                          onClick={() => {
                            setDescription(
                              el.description || "Missing description"
                            );
                            setProposal(el.proposal);
                            open();
                          }}
                        >
                          Read More
                        </span>{" "}
                      </Description>
                    ) : (
                      el.description
                    )}
                  </DescriptionWrapper>
                </td>
                <td>
                  <div>{el.unix}</div>
                  <FullDate>({el.timestamp})</FullDate>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <DescriptionModal
        isOpen={isOpen}
        close={close}
        ref={modalRef}
        description={description}
        setDescription={setDescription}
        proposal={proposal}
        setProposal={setProposal}
      />
    </Wrapper>
  );
};

export default UpcomingRequests;
