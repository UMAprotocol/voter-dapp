import { styled } from "twin.macro"; // eslint-disable-line

export const StyledFooter = styled.div`
  max-width: 1280px;
  margin: 3rem auto 0;
  font-family: "Halyard Display";
  min-height: 20vh;
  padding-bottom: 2rem;
`;

export const LogoWrapper = styled.div`
  flex: 0 0 24%;
  @media screen and (max-width: 768px) {
    margin-bottom: 2rem;
    margin-left: 1rem;
    text-align: center;
    svg {
      margin: 0 auto;
    }
  }
`;

export const LinkWrapper = styled.div`
  padding: 0 100px;
  flex: 1 1;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  @media screen and (max-width: 768px) {
    width: 95%;
    margin: 0 auto;
    text-align: center;
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
`;

export const SubscribeWrapper = styled.div`
  flex: 0 0 32%;
  max-width: 32%;
  padding-left: 30px;
  text-align: right;
  @media screen and (max-width: 768px) {
    width: 100%;
    margin: 0 auto;
    max-width: 100%;
  }
  .subscribe {
    display: inline-block;
    max-width: 285px;
    width: 100%;
    margin-bottom: 33px;
    padding: 5px 0 0;
    text-align: left;
    @media screen and (max-width: 768px) {
      width: 95%;
      margin: 0 auto;
      max-width: 95%;
    }
    h3 {
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
    @media screen and (max-width: 768px) {
      width: 95%;
      margin: 0 auto;
      max-width: 95%;
    }
  }
  .sm-logo {
    height: 25px;
    &:hover {
      transition: opacity 0.2s;
      opacity: 0.7;
    }
    @media screen and (max-width: 768px) {
      margin: 0 0.5rem;
    }
  }
`;

export const Flex = styled.div`
  display: flex;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
