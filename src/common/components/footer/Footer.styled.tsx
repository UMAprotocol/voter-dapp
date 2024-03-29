import { styled } from "twin.macro"; // eslint-disable-line
import { COLORS, QUERIES } from "common/utils/constants";
import { BaseButton } from "../button";
import { UniversalLink } from "../link";

export const Container = styled.footer`
  border-top: 1px solid hsla(${COLORS.black} / 0.1);
`;

export const Content = styled.div`
  padding: 50px 30px;
  margin: auto;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media ${QUERIES.laptopAndUp} {
    flex-direction: row;
    max-width: 1200px;
    padding: 80px 20px;
  }
`;

export const ContentItem = styled.div`
  width: 100%;

  @media ${QUERIES.laptopAndUp} {
    padding: 0 40px;

    :nth-of-type(1) {
      width: 55%;
    }

    :nth-of-type(2) {
      width: 45%;
      border-left: 1px solid hsl(${COLORS.gray[500]});
    }
  }
`;

export const Logo = styled.img`
  width: 100px;
  height: 25px;
  color: hsl(${COLORS.primary[500]});
`;

export const NavContainer = styled.div`
  margin: 40px 0 0;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;

  @media ${QUERIES.laptopAndUp} {
    margin: auto;
    max-width: 280px;
    justify-content: space-between;
  }
`;

export const NavLinks = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;

  li {
    margin: 15px 0;
  }
`;

export const NavLink = styled(UniversalLink)`
  position: relative;
  font-size: ${14 / 16}rem;
  line-height: 20px;
  font-weight: 700;

  ::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 3px;
    background-color: hsl(${COLORS.primary[500]});
    transition: width 0.2s ease-out;
  }

  :hover {
    ::after {
      width: 100%;
    }
  }
`;

export const NewsletterFormContainer = styled.div`
  margin: 40px 0 0;

  @media ${QUERIES.laptopAndUp} {
    max-width: 360px;
  }
`;

export const FooterHeading = styled.h6`
  color: hsl(${COLORS.primary[500]});
  font-size: ${15 / 16}rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

export const NewsletterText = styled.p`
  max-width: 280px;
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: ${14 / 16}rem;
`;

export const NewsletterForm = styled.form``;

export const NewsletterInputContainer = styled.div<{ highlighted: boolean }>`
  display: flex;
  border-bottom: 1px solid;
  border-color: ${({ highlighted }) =>
    highlighted ? "hsl(" + COLORS.primary[500] + ")" : "hsla(" + COLORS.black + " / 0.3)"};
  transition: border-color 0.2s ease-out;

  svg {
    color: hsla(${COLORS.black} / 0.5);
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 8px 8px 0;
  color: hsla(${COLORS.black} / 0.6);
  font-size: ${14 / 16}rem;
  background-color: transparent;
  border: none;
  outline: none;
  transition: color 0.2s ease-out;

  :focus {
    color: hsl(${COLORS.primary[500]});
  }
`;

export const SubmitButton = styled(BaseButton)`
  padding-left: 10px;
`;

export const FormMessage = styled.div`
  margin: 10px 0 0;
  font-size: ${14 / 16}rem;
  color: hsl(${COLORS.gray[700]});

  & > a {
    color: currentColor;
  }
`;
