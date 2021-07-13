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
export const MobileButton = styled.div`
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
    &:first-of-type {
      top: 0;
    }
    &:nth-child(2) {
      top: 8px;
    }
    &:nth-child(3) {
      top: 16px;
    }
    position: absolute;
    transition: top 0.2s 0.25s, opacity 0.2s 0.25s, transform 0.2s 0s,
      -webkit-transform 0.2s 0s;
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
