/** @jsxImportSource @emotion/react */
import { ForwardRefRenderFunction, forwardRef } from "react";

import tw, { styled } from "twin.macro"; // eslint-disable-line
import { useController, Control } from "react-hook-form";

interface Props {
  control: Control;
  name: string;
  label?: string;
  placeholder?: string;
}

// Fancy Select coming. Basic one for testing.
const _Select: ForwardRefRenderFunction<HTMLSelectElement, Props> = (
  props,
  externalRef
) => {
  const { field } = useController(props);

  return (
    <StyledSelect
      {...field}
      ref={field.ref}
      onChange={field.onChange}
      value={field.value}
    >
      <option value="">---</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </StyledSelect>
  );
};

const Select = forwardRef(_Select);
Select.displayName = "Select";

const StyledSelect = styled.select`
  height: 20px;
  width: 100%;
  max-width: 200px;
`;

export default Select;
