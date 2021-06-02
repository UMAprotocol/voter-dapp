/** @jsxImportSource @emotion/react */
import {
  ForwardRefRenderFunction,
  forwardRef,
  ChangeEventHandler,
} from "react";

import tw, { styled } from "twin.macro"; // eslint-disable-line
import { useController, Control } from "react-hook-form";

interface Props {
  control: Control;
  name: string;
  variant?: "text" | "search" | "currency";
  label?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  rules?: {
    pattern: {
      value: RegExp;
      message: string;
    };
  };
  setError: any;
  setValue: any;
  showValueInLabel: boolean;
}

const _TextInput: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  props,
  externalRef
) => {
  const {
    field: { ref, ...inputProps },
    fieldState,
  } = useController({
    name: props.name,
    control: props.control,
    rules: props.rules,
    defaultValue: "",
  });

  return (
    <StyledInput className="TextInput">
      <label className="label">{props.label}</label>
      <div>
        <input
          {...inputProps}
          placeholder={props.placeholder}
          onChange={(e) => {
            const value = e.target.value;
            props.setValue(props.name, value);
            if (props.rules) {
              const regExp = new RegExp(props.rules?.pattern.value);
              regExp.test(value);
              if (!regExp.test(value)) {
                props.setError(props.name, {
                  message: props.rules.pattern.message,
                });
              } else {
                props.setError(props.name, undefined);
              }
              if (value === "" || value === undefined)
                props.setError(props.name, undefined);
            }
          }}
        />
        {props.variant === "currency" ? (
          <span className="dollar-sign">$</span>
        ) : null}
      </div>
      {fieldState.error && fieldState.error.message && (
        <TextInputError>{fieldState.error.message}</TextInputError>
      )}
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
    /* width: 100%; */
    width: 250px;
    background-color: #f4f5f4;
    padding: 1rem 1.25rem;
    /* margin-bottom: 2rem; */
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

const TextInputError = styled.div`
  color: #ff4d4c;
  margin-bottom: 2rem;
`;

export default TextInput;
