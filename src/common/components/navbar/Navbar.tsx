import { useState } from "react";
import { COMMUNITY_LINKS, LINKS } from "../../utils/constants";
import { DownIcon } from "../icons";
import * as UI from "./Navbar.styled";
import logo from "assets/icons/logo.svg";
import { useLocation } from "react-router-dom";

const NavLinks = () => {
  const { pathname } = useLocation();
  return (
    <UI.LinkList>
      {HEADER_LINKS.map((link) => (
        <UI.LinkListItem key={link.key}>
          {link.component({ path: pathname })}
        </UI.LinkListItem>
      ))}
    </UI.LinkList>
  );
};

export const Header: React.FunctionComponent = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const onToggle = () => {
    setShowMobileMenu((prevShowMobileMenu) => !prevShowMobileMenu);
  };

  return (
    <UI.Container>
      <UI.Content>
        <UI.LogoLink to="/">
          <UI.LogoLinkIcon src={logo} alt="UMA logo" />
        </UI.LogoLink>
        <UI.NavContainer>
          <NavLinks />
        </UI.NavContainer>
        <MenuToggle toggled={showMobileMenu} onToggle={onToggle} />
        <MobileMenuComponent show={showMobileMenu} onClickLink={onToggle} />
      </UI.Content>
    </UI.Container>
  );
};

const MobileMenuComponent: React.FC<{
  show: boolean;
  onClickLink: () => void;
}> = ({ show, onClickLink }) => {
  const { pathname } = useLocation();

  return (
    <UI.MobileMenuContainer show={show}>
      {MOBILE_HEADER_LINKS.map((link) =>
        link.component({ path: pathname, onClick: onClickLink })
      )}
      <UI.MobileCommunityLinks>
        {COMMUNITY_LINKS.map((link, idx) => (
          <UI.MobileCommunityLink key={idx} to={link.href} target="_blank">
            <img src={link.iconSrc} alt={link.alt} width={25} height={25} />
          </UI.MobileCommunityLink>
        ))}
      </UI.MobileCommunityLinks>
    </UI.MobileMenuContainer>
  );
};

const MenuToggle: React.FC<{ toggled: boolean; onToggle: () => void }> = ({
  toggled,
  onToggle,
}) => {
  return (
    <UI.MenuToggleButton onClick={onToggle} toggled={toggled}>
      <span></span>
      <span></span>
      <span></span>
    </UI.MenuToggleButton>
  );
};

const CommunityDropdown: React.FunctionComponent = () => {
  return (
    <UI.CommunityDropdownContainer>
      <UI.DropdownButton>
        Community
        <DownIcon />
      </UI.DropdownButton>
      <UI.DropdownValuesContainer>
        <UI.CommunityLinks>
          {COMMUNITY_LINKS.map((link, idx) => (
            <UI.CommunityLink key={idx} to={link.href} target="_blank">
              <img src={link.iconSrc} alt={link.alt} width={25} height={25} />
              <span>{link.name}</span>
            </UI.CommunityLink>
          ))}
        </UI.CommunityLinks>
      </UI.DropdownValuesContainer>
    </UI.CommunityDropdownContainer>
  );
};

interface IHeaderLink {
  key: string;
  component: (args: { path: string; onClick?: () => void }) => JSX.Element;
}

const HEADER_LINKS: IHeaderLink[] = [
  {
    key: "Projects",
    component: () => <UI.NavLink to={LINKS.projects}>Projects</UI.NavLink>,
  },
  {
    key: "Products",
    component: () => <UI.NavLink to={LINKS.products}>Products</UI.NavLink>,
  },
  {
    key: "Docs",
    component: () => (
      <UI.NavLink to={LINKS.docs} target="_blank">
        Docs
      </UI.NavLink>
    ),
  },
  {
    key: "Community",
    component: () => <CommunityDropdown />,
  },
  {
    key: "Vote",
    component: ({ path }) => {
      return (
        <UI.NavLink to="/" active={path === "/"}>
          Vote
        </UI.NavLink>
      );
    },
  },
];

const MOBILE_HEADER_LINKS: IHeaderLink[] = [
  {
    key: "Projects",
    component: () => (
      <UI.MobileNavLink to={LINKS.projects}>Projects</UI.MobileNavLink>
    ),
  },
  {
    key: "Products",
    component: () => (
      <UI.MobileNavLink to={LINKS.products}>Products</UI.MobileNavLink>
    ),
  },
  {
    key: "Docs",
    component: () => (
      <UI.MobileNavLink to={LINKS.docs} target="_blank">
        Docs
      </UI.MobileNavLink>
    ),
  },
  {
    key: "Vote",
    component: ({ path, onClick }) => (
      <UI.MobileNavLink to="/" active={path === "/"} onClick={onClick}>
        Vote
      </UI.MobileNavLink>
    ),
  },
];
