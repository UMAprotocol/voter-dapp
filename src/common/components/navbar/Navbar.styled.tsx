import tw, { styled } from "twin.macro"; // eslint-disable-line

export const StyledNavbar = styled.nav`
  margin: 1rem auto;
  font-family: "Halyard Display";
  font-weight: 600;
  ${tw`flex justify-between flex-wrap bg-white p-3 max-w-7xl`}
  .logo {
    height: 30px;
  }
`;

export const DesktopLinks = styled.div`
  @media screen and (max-width: 768px) {
    display: none;
  }
  .sm-logo {
    height: 25px;
    &:hover {
      transition: opacity 0.2s;
      opacity: 0.7;
    }
  }
  .link {
    &.active {
      color: #ff4a4a;
      &:hover {
        text-decoration: underline;
      }
    }
    &:hover {
      transition: color 0.3s;
      color: #ff4a4a;
      text-decoration: underline;
    }
  }
`;

export const MobileLinks = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
  }
`;

export const MobileList = styled.div``;
export const MobileLink = styled.a``;

interface MobileButtonProps {
  isOpen?: boolean;
}
export const MobileButton = styled.div<MobileButtonProps>`
  cursor: pointer;
  pointer-events: all;
  opacity: 1;
  position: relative;
  height: 20px;
  width: 25px;
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
  }
  span {
    transition: top 0.2s 0.25s, opacity 0.2s 0.25s, transform 0.2s 0s,
      -webkit-transform 0.2s 0s;
    &:first-of-type {
      top: ${(props) => (props.isOpen ? "9px" : "0px")};
      transform: ${(props) => (props.isOpen ? "rotate(45deg)" : "")};
    }
    &:nth-of-type(2) {
      top: 8px;
      opacity: ${(props) => (props.isOpen ? "0" : "1")};
    }
    &:nth-of-type(3) {
      top: ${(props) => (props.isOpen ? "9px" : "16px")};
      transform: ${(props) => (props.isOpen ? "rotate(-45deg)" : "")};
    }

    position: absolute;

    padding: 0;
    margin: 0;
    outline: 0;
    height: 2px;
    width: 25px;
    font-weight: 400;
    font-size: 18px;
    line-height: 1.67;
    color: #000;
    display: block;
    background-color: #000;
    border: none;
  }
`;
