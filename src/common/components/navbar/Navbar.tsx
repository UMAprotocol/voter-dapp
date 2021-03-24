/** @jsxImportSource @emotion/react */
import { FC } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line

import { Link } from "react-router-dom";
import logo from "assets/logo.png";
import discordLogo from "assets/ico-discord.svg";
import githubLogo from "assets/ico-github.svg";
import mediumLogo from "assets/ico-medium.svg";
import twitterLogo from "assets/ico-tw.svg";

const Wrapper = styled.nav`
  margin: 0 auto;
  margin-top: 1rem;
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
    &:hover {
      transition: color 0.3s;
      color: #ff4a4a;
    }
  }
`;

const Navbar: FC = () => {
  return (
    <Wrapper tw="flex justify-between flex-wrap bg-white p-3 max-w-7xl">
      <Link tw="inline-flex items-center p-2 mr-4" to="/">
        <img className="logo" src={logo} alt="uma_logo" />
      </Link>
      <div tw="inline-flex items-center">
        <Link to="/" tw=""></Link>
        <div tw="flex place-items-end">
          <Link className="link" to="/" tw="px-5 py-3">
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
          <Link className="link" to="/" tw="px-5 py-3">
            About
          </Link>
          <a
            href="https://medium.com/uma-project"
            tw="px-5 py-3"
            target="_blank"
            rel="noreferrer"
          >
            <img className="sm-logo" src={mediumLogo} alt="medium_logo" />
          </a>
          <a
            href="https://github.com/UMAprotocol"
            tw="px-5 py-3"
            target="_blank"
            rel="noreferrer"
          >
            <img className="sm-logo" src={githubLogo} alt="medium_logo" />
          </a>
          <a
            href="https://twitter.com/UMAprotocol"
            tw="px-5 py-3"
            target="_blank"
            rel="noreferrer"
          >
            <img className="sm-logo" src={twitterLogo} alt="medium_logo" />
          </a>
          <a
            href="https://medium.com"
            tw="px-5 py-3"
            target="_blank"
            rel="noreferrer"
          >
            <img className="sm-logo" src={discordLogo} alt="medium_logo" />
          </a>
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
