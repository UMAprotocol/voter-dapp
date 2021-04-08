/** @jsxImportSource @emotion/react */
import { useState, ForwardRefRenderFunction, forwardRef } from "react";

import tw, { styled } from "twin.macro"; // eslint-disable-line
import { FieldElement } from "react-hook-form";
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
    <StyledInput>
      <label>{props.label}</label>
      <input {...field} placeholder={props.placeholder} ref={field.ref} />
      {props.variant === "currency" ? (
        <span className="dollar-sign">$</span>
      ) : null}
    </StyledInput>
  );
};

const TextInput = forwardRef(_TextInput);
TextInput.displayName = "Modal";

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

export default TextInput;
