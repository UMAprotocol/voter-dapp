/** @jsxImportSource @emotion/react */
import { FC } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line

import { Link } from "react-router-dom";
import { Discord, Github, Medium, Twitter } from "assets/icons";
import logo from "assets/icons/logo.png";

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
            <Medium className="sm-logo" />
          </a>
          <a
            href="https://github.com/UMAprotocol"
            tw="px-5 py-3"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="sm-logo" />
          </a>
          <a
            href="https://twitter.com/UMAprotocol"
            tw="px-5 py-3"
            target="_blank"
            rel="noreferrer"
          >
            <Twitter className="sm-logo" />
          </a>
          <a
            href="https://discord.umaproject.org"
            tw="px-5 py-3"
            target="_blank"
            rel="noreferrer"
          >
            <Discord className="sm-logo" />
          </a>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
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
    &:hover {
      transition: color 0.3s;
      color: #ff4a4a;
    }
  }
`;

export default Navbar;
