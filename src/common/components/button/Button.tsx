/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro";

type Variant = "primary" | "secondary" | "disabled";

type Props = {
  variant?: Variant;
};

const Button = styled.button<Props>`
  ${tw`inline-flex items-center justify-center p-2 rounded `};
  min-width: 130px;
  > svg {
    margin-left: 10px;
  }

  color: ${({ variant }) =>
    variant === "primary"
      ? "#FF4A4A"
      : variant === "secondary"
      ? "#ffffff"
      : "#040504"};

  background-color: ${({ variant }) =>
    variant === "primary"
      ? "#ffffff"
      : variant === "secondary"
      ? "#FF4A4A"
      : "#F1F0F0"};

  cursor: ${({ variant }) =>
    variant === "disabled" ? "not-allowed" : "pointer"};

  pointer-events: ${({ variant }) => (variant === "disabled" ? "none" : "all")};
`;

Button.defaultProps = {
  variant: "primary",
};

export default Button;
