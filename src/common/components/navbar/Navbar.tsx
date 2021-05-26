/** @jsxImportSource @emotion/react */
import { FC } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line

import { Link } from "react-router-dom";
import { Discord, Github, Medium, Twitter } from "assets/icons";
import logo from "assets/icons/logo.png";

const Navbar: FC = () => {
  return (
    <StyledNavbar tw="flex justify-between flex-wrap bg-white p-3 max-w-7xl">
      <Link tw="inline-flex items-center p-2 mr-4" to="/">
        <img className="logo" src={logo} alt="uma_logo" />
      </Link>
      <div tw="inline-flex items-center">
        <Link to="/" tw=""></Link>
        <div tw="flex place-items-end">
          <Link className="link active" to="/" tw="px-5 py-3">
            Vote
          </Link>
          <Link className="link" to="/" tw="px-5 py-3">
            FAQs
          </Link>
          <a
            className="link"
            href="https://docs.umaproject.org/"
            target="_blank"
            tw="px-5 py-3"
            rel="noreferrer"
          >
            Docs
          </a>

          <a
            className="link"
            href="https://docs.umaproject.org/uma-tokenholders/uma-holders"
            target="_blank"
            tw="px-5 py-3"
            rel="noreferrer"
          >
            About
          </a>
          {socialLinks.map(({ logo, url }, index) => {
            return (
              <a
                key={index}
                href={url}
                tw="px-5 py-3"
                target="_blank"
                rel="noreferrer"
              >
                {logo}
              </a>
            );
          })}
        </div>
      </div>
    </StyledNavbar>
  );
};

const socialLinks = [
  {
    url: "https://medium.com/uma-project",
    logo: <Medium className="sm-logo" />,
  },
  {
    url: "https://github.com/UMAprotocol",
    logo: <Github className="sm-logo" />,
  },
  {
    url: "https://twitter.com/UMAprotocol",
    logo: <Twitter className="sm-logo" />,
  },
  {
    url: "https://discord.umaproject.org",
    logo: <Discord className="sm-logo" />,
  },
];

const StyledNavbar = styled.nav`
  margin: 1rem auto;
  font-family: "Halyard Display";
  font-weight: 600;
  .logo {
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

export default Navbar;
