import medium from "assets/icons/social/medium.svg";
import github from "assets/icons/social/github.svg";
import twitter from "assets/icons/social/twitter.svg";
import discord from "assets/icons/social/discord.svg";
import discourse from "assets/icons/social/discourse.svg";

export const COLORS = {
  gray: {
    100: "0deg 0% 99%",
    200: "hsl(120, 100%, 100%)",
    300: "0deg 0% 96%",
    400: "0deg 0% 56%",
    500: "0deg 0% 90%",
    600: "0deg 0% 35%",
    700: "280deg 4% 15%",
  },
  primary: { 500: "0deg 100% 65%", 700: "0deg 100% 45%" },
  green: "133deg 68% 39%",
  white: "0deg 100% 100%",
  black: "0deg 0% 0%",
};

export const BREAKPOINTS = {
  tabletMin: 550,
  laptopMin: 800,
  desktopMin: 1500,
};

export const QUERIES = {
  tabletAndUp: `(min-width: ${BREAKPOINTS.tabletMin / 16}rem)`,
  laptopAndUp: `(min-width: ${BREAKPOINTS.laptopMin / 16}rem)`,
  desktopAndUp: `(min-width: ${BREAKPOINTS.desktopMin / 16}rem)`,
  tabletAndDown: `(max-width: ${(BREAKPOINTS.laptopMin - 1) / 16}rem)`,
};

export const LINKS = {
  docs: "https://docs.umaproject.org/",
  projects: "https://projects.umaproject.org/",
  products: "https://umaproject.org/products",
  getStarted: "https://docs.umaproject.org/build-walkthrough/build-process",
  faq: "https://umaproject.org/faq",
  vote: "https://vote.umaproject.org/",
};

export const COMMUNITY_LINKS = [
  {
    name: "Medium",
    href: "https://medium.com/uma-project",
    iconSrc: medium,
    alt: "medium",
  },
  {
    name: "Github",
    href: "https://github.com/umaprotocol",
    iconSrc: github,
    alt: "github",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/umaprotocol",
    iconSrc: twitter,
    alt: "twitter",
  },
  {
    name: "Discord",
    href: "https://discord.com/invite/jsb9XQJ",
    iconSrc: discord,
    alt: "discord",
  },
  {
    name: "Discourse",
    href: "https://discourse.umaproject.org/",
    iconSrc: discourse,
    alt: "discourse",
  },
];