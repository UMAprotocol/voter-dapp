/** @jsxImportSource @emotion/react */
import { styled } from "twin.macro";

interface IDropdownStyledProps {
  isOpen?: boolean;
  isHighlighted?: boolean;
  isRHF?: boolean;
}

export const DropdownContainer = styled.div`
  width: 250px;
`;

export const DropdownHeader = styled.button<IDropdownStyledProps>`
  padding: 10px;
  display: flex;
  border-radius: 6px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => (props.isOpen ? "#ff4b4b" : "transparent")};
  min-width: 100%;
  /* width: 297px; */
  background-color: ${(props) => (props.isOpen ? "#fff" : "#F1F0F0")};
  color: ${(props) => (props.isOpen ? "#ff4b4b" : "#919191")};
`;

export const DropdownList = styled.ul<IDropdownStyledProps>`
  max-height: "200px";
  overflow-y: "auto";
  width: ${(props) => (props.isRHF ? "250px" : "150px")};
  margin: ${(props) => (props.isRHF ? "55px 0 0 0 " : "12px 0 0 0")};
  border-width: ${(props) => (props.isOpen ? "1px" : "0")};
  border-style: solid;
  border-color: #e5e4e4;
  background-color: "#fff";
  list-style: none;
  position: absolute;
  width: 250px;
  border-radius: 8px;
  color: #ff4b4b;
`;
export const DropdownListItem = styled.li<IDropdownStyledProps>`
  padding: 5px;
  background: ${(props) => (props.isHighlighted ? "#A0AEC0" : "")};
`;

export const Arrow = styled.span`
  position: absolute;
  margin-left: 220px;
`;

export const UpArrow = styled(Arrow)`
  opacity: 0.8;
  color: #ff4b4b;
`;

export const DownArrow = styled(Arrow)`
  color: #919191;
`;
