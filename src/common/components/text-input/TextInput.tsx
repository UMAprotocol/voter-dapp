/** @jsxImportSource @emotion/react */
import { useState, FC } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line

interface Props {
  variant?: "text" | "search" | "currency";
  label?: string;
  placeholder?: string;
}
const TextInput: FC<Props> = ({ label, placeholder, variant }) => {
  const [value, setValue] = useState("");

  return (
    <StyledInput>
      <label>{label}</label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {variant === "currency" ? <span className="dollar-sign">$</span> : null}
    </StyledInput>
  );
};

const StyledInput = styled.div`
  input {
    min-height: 25px;
    min-width: 150px;
    width: 100%;
    background-color: #f4f5f4;
    padding: 1rem 1.5rem;
  }
  .dollar-sign {
    position: absolute;
    padding-left: 12px;
  }
`;

export default TextInput;
