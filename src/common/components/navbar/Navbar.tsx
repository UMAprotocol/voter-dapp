/** @jsxImportSource @emotion/react */
import { FC } from "react";
import tw from "twin.macro"; // eslint-disable-line

import { Link } from "react-router-dom";
import {
  StyledNavbar,
  DesktopLinks,
  MobileLinks,
  MobileButton,
} from "./Navbar.styled";
import { Discord, Github, Medium, Twitter } from "assets/icons";
import logo from "assets/icons/logo.png";

const Navbar: FC = () => {
  return (
    <StyledNavbar>
      <Link tw="inline-flex items-center p-2 mr-4" to="/">
        <img className="logo" src={logo} alt="uma_logo" />
      </Link>
      <MobileButton>
        <span />
        <span />
        <span />
      </MobileButton>
      {/* <MobileLinks>
        <Link to="/" tw="" />
      </MobileLinks> */}
      <DesktopLinks tw="inline-flex items-center">
        <Link to="/" tw=""></Link>
        <div tw="flex place-items-end">
          <Link className="link active" to="/" tw="px-5 py-3">
            Vote
          </Link>
          {/* <Link className="link" to="/" tw="px-5 py-3">
            FAQs
          </Link> */}
          <a
            className="link"
            href="https://v1.vote.umaproject.org/"
            target="_blank"
            tw="px-5 py-3"
            rel="noreferrer"
          >
            V1 Vote
          </a>
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
      </DesktopLinks>
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

export default Navbar;
