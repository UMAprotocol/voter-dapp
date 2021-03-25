/** @jsxImportSource @emotion/react */
import { FC } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line

const Footer: FC = () => {
  return <Wrapper>Footer</Wrapper>;
};

const Wrapper = styled.div`
  margin: 1rem auto;
  font-family: "Halyard Display";
  font-weight: 600;
  /* .logo {
    height: 30px;
  }
  .sm-logo {
    height: 25px;
    &:hover {
      transition: opacity 0.2s;
      opacity: 0.7;
    }
  }
  .link {
    &:hover {
      transition: color 0.3s;
      color: #ff4a4a;
    }
  } */
`;

export default Footer;
