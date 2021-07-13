/** @jsxImportSource @emotion/react */
import { FC, useState } from "react";
import tw from "twin.macro"; // eslint-disable-line

import { Link } from "react-router-dom";
import {
  StyledNavbar,
  DesktopLinks,
  DesktopLink,
  DesktopSocialLink,
  MobileLinks,
  MobileButton,
} from "./Navbar.styled";
import { Discord, Github, Medium, Twitter } from "assets/icons";
import logo from "assets/icons/logo.png";

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <StyledNavbar>
      <Link tw="inline-flex items-center p-2 mr-4" to="/">
        <img className="logo" src={logo} alt="uma_logo" />
      </Link>
      <MobileButton
        isOpen={isOpen}
        onClick={() => setIsOpen((prevValue) => !prevValue)}
      >
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
          <DesktopLink
            href="https://v1.vote.umaproject.org/"
            target="_blank"
            rel="noreferrer"
          >
            V1 Vote
          </DesktopLink>
          <DesktopLink
            href="https://docs.umaproject.org/"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </DesktopLink>

          <DesktopLink
            href="https://docs.umaproject.org/uma-tokenholders/uma-holders"
            target="_blank"
            rel="noreferrer"
          >
            About
          </DesktopLink>
          {socialLinks.map(({ logo, url }, index) => {
            return (
              <DesktopSocialLink
                key={index}
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                {logo}
              </DesktopSocialLink>
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
