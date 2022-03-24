import React from "react";
import styled from "@emotion/styled";
import { LinkProps } from "react-router-dom";
import { Link } from "react-router-dom";

type Props = React.PropsWithChildren<LinkProps> & {
  className?: string;
  target?: string;
  onClick?: () => void;
};
export const UniversalLink: React.FC<Props> = ({
  children,
  className,
  target,
  onClick,
  to,
  ...delegated
}) => {
  const rel = target === "_blank" ? "noopener norefferer" : undefined;
  if (to.toString().includes("http")) {
    return <StyledLink
      className={className}
      target={target}
      rel={rel}
      onClick={onClick}
      href={to.toString()}
    >
      {children}
    </StyledLink>;
  }
  return (
    <Link
      className={className}
      target={target}
      rel={rel}
      onClick={onClick}
      to={to}
      {...delegated}
    >
      {children}
    </Link>
  );
};

const StyledLink = styled.a`
  position: relative;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`;
