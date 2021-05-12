/** @jsxImportSource @emotion/react */
import { ForwardRefRenderFunction, forwardRef } from "react";

import tw, { styled } from "twin.macro"; // eslint-disable-line
import { useController, Control } from "react-hook-form";

interface Props {
  control: Control;
  name: string;
  variant?: "text" | "search" | "currency";
  label?: string;
  placeholder?: string;
}

const _TextInput: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  props,
  externalRef
) => {
  const { field } = useController(props);

  return (
    <StyledInput className="TextInput">
      <label className="label">{props.label}</label>
      <div>
        <input
          {...field}
          placeholder={props.placeholder}
          ref={field.ref}
          value={field.value}
          onChange={field.onChange}
        />
        {props.variant === "currency" ? (
          <span className="dollar-sign">$</span>
        ) : null}
      </div>
    </StyledInput>
  );
};

const TextInput = forwardRef(_TextInput);
TextInput.displayName = "Modal";

export const StyledInput = styled.div`
  display: flex;
  flex-direction: column;
  .label {
    width: 100%;
    padding-left: 4px;
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
    margin-top: 14px;
    pointer-events: none;
    /* color: #ff4d4c; */
  }
`;

export default TextInput;
