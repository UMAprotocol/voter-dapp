/** @jsxImportSource @emotion/react */
import { FC } from "react";
import tw, { styled } from "twin.macro"; // eslint-disable-line
import { FooterLogo } from "assets/icons";
import { Discord, Github, Medium, Twitter } from "assets/icons";

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
    url: "https://medium.com/uma-project",
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

const StyledFooter = styled.div`
  max-width: 1280px;
  margin: 3rem auto 0;
  font-family: "Halyard Display";
  min-height: 20vh;
  .logo-wrapper {
    flex: 0 0 24%;
  }
  .link-wrapper {
    padding: 0 100px;
    flex: 1 1;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }
  .links {
    display: flex;
    flex-wrap: wrap;
    .link {
      flex-basis: 50%;
      margin-bottom: 1.25rem;
      font-weight: 600;
      a {
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .subscribe-wrapper {
    flex: 0 0 32%;
    max-width: 32%;
    padding-left: 30px;
    text-align: right;
    .subscribe {
      display: inline-block;
      max-width: 285px;
      width: 100%;
      margin-bottom: 33px;
      padding: 5px 0 0;
      text-align: left;
      .header {
        text-align: left;
        color: #ff4a4a;
        margin-bottom: 0.8rem;
      }
      .sub-text {
        text-align: left;
        font-size: 0.8rem;
        opacity: 0.75;
        margin: 0 0 15px;
        color: #000;
        line-height: 1.57;
      }
    }
    .sm-links-wrapper {
      display: flex;
      max-width: 50%;
    }
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
  }
`;

export default Footer;
