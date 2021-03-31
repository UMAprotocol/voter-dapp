/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro";

type Variant = "primary" | "secondary";

type Props = {
  variant?: Variant;
};

const Button = styled.button<Props>`
  ${tw`inline-flex items-center justify-center p-2 rounded `};
  > svg {
    margin-left: 10px;
  }
  ${({ variant }) =>
    variant === "primary" ? tw`text-white` : tw` text-black`};

  ${({ variant }) =>
    variant === "primary"
      ? `background-color: #FF4A4A`
      : `background-color: #ffffff`};
`;

export default Button;