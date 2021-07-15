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
`;

export const DesktopLink = styled.a`
  ${tw`px-5 py-3`};
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
`;

export const DesktopSocialLink = styled.a`
  ${tw`px-5 py-3`};
  svg {
    height: 25px;
    &:hover {
      transition: opacity 0.2s;
      opacity: 0.7;
    }
  }
`;

export const MobileLinks = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
  }
`;

interface MobileContentProps {
  isOpen?: boolean;
}
export const MobileContent = styled.div<MobileContentProps>`
  opacity: 1;
  pointer-events: all;
  transform: translateY(0);
  position: absolute;
  top: 6rem;
  left: 0;
  right: 0;
  z-index: 1;
  display: block;
  margin-top: -1px;
  text-align: left;
  background: #fff;
`;
export const MobileNav = styled.nav`
  display: block;
  text-align: left;
  @media screen and (min-width: 769px) {
    display: none;
  }
`;
export const MobileList = styled.ul`
  margin: -5px 30px 31px;
  display: block;
`;
export const MobileListItem = styled.li`
  list-style: none;
  border-bottom: 1px solid #e5e5e5;
  margin: 1rem 0;
  a {
    font-size: 16px;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s;
    color: inherit;
    display: block;
    &.active {
      color: #ff4a4a;
    }
    &:hover {
      transition: color 0.3s;
      color: #ff4a4a;
      text-decoration: underline;
    }
  }
`;

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
  margin-top: 1rem;
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
  }
  span {
    transition: top 0.2s 0.25s, opacity 0.2s 0.25s, transform 0.2s 0s,
      -webkit-transform 0.2s 0s;

    transition: ${(props) =>
      props.isOpen
        ? "background 0.2s, top 0.2s, opacity 0.2s, transform 0.2s 0.25s,-webkit-transform 0.2s 0.25s"
        : ""};
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

export const SocialMobileList = styled.ul`
  margin: 0 30px 20px;
  justify-content: flex-start;
  display: flex;
  li {
    list-style: none;
    width: 25px;
  }
  li + li {
    margin-left: 34px;
  }
  @media screen and (min-width: 769px) {
    display: none;
  }
`;
