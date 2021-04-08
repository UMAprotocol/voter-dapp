/** @jsxImportSource @emotion/react */
import { useState, useEffect, FC } from "react";
import tw, { styled } from "twin.macro";

interface Props {
  variant: "text" | "search";
  label: string;
}
const TextInput: FC<Props> = ({ label }) => {
  const [value, setValue] = useState("");

  return (
    <StyledInput>
      <label>{label}</label>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </StyledInput>
  );
};

const StyledInput = styled.div`
  min-height: 25px;
  width: 150px;
`;

export default TextInput;
