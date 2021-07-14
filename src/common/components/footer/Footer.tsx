/** @jsxImportSource @emotion/react */
import { FC } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { FooterLogo } from "assets/icons";
import { Discord, Github, Medium, Twitter } from "assets/icons";
import { StyledFooter } from "./Footer.styled";

const Footer: FC = () => {
  return (
    <StyledFooter>
      <div tw="flex">
        <div className="logo-wrapper">
          <FooterLogo />
          <div tw="mt-4 opacity-75">Risk Labs &copy; 2021</div>
        </div>
        <div className="link-wrapper">
          <ul className="links">
            {umaLinks.map(({ url, text }, index) => {
              return (
                <li key={index} className="link">
                  <a href={url} target="_blank" rel="noreferrer">
                    {text}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="subscribe-wrapper">
          <div className="subscribe">
            <h3 className="header">Get UMA Updates</h3>
            <p className="sub-text">
              Sign up for our newsletter to stay updated about the UMA project.
            </p>
            <div className="sm-links-wrapper">
              {socialLinks.map(({ logo, url }, index) => {
                return (
                  <a
                    key={index}
                    href={url}
                    tw="pr-2 py-3 flex-grow"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {logo}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </StyledFooter>
  );
};

const umaLinks = [
  {
    url: "https://docs.umaproject.org/getting-started/overview",
    text: "How UMA Works",
  },
  {
    url: "https://docs.umaproject.org/build-walkthrough/build-process",
    text: "Getting Started",
  },
  {
    url: "https://docs.umaproject.org/",
    text: "Docs",
  },
  {
    url: "https://umaproject.org/faq",
    text: "FAQs",
  },
  {
    url: "https://angel.co/company/uma-project/jobs",
    text: "Careers",
  },
  {
    url: "mailto:hello@umaproject.org",
    text: "Contact",
  },
];

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

export default Footer;
