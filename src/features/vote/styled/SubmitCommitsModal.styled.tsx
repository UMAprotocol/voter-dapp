/** @jsxImportSource @emotion/react */
import tw, { styled } from "twin.macro"; // eslint-disable-line

export const ModalWrapper = styled.div`
  /* max-width: 700; */
  min-width: 400px;
  padding: 2rem 1.5rem;
  height: auto;
  max-height: 80vh;
  position: relative;
  background-color: #fff;
  z-index: 1;
  overflow-y: auto;
  border-radius: 12px;
  margin: 0;
  outline: 0;
  box-sizing: border-box;
  font-family: "Halyard Display";
  border: none;
  .header {
    text-align: center;
    margin-bottom: 1rem;
    font-weight: 600;
    font-size: 1.25rem;
  }
  .header-body {
    border-color: #e5e5e5;
    padding-bottom: 4rem;
  }
  .open-form {
    color: #ff4a4a;
    font-size: 0.8rem;
    line-height: 2rem;
    text-decoration: underline;
  }
  .icon-wrapper {
    margin-top: 1rem;
    height: 100px;
    .unlocked-icon {
      margin: 0 auto;
      transform: scale(2);
    }
  }
  .vote-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    border-bottom: 1px solid #e5e5e5;
    div:last-child {
      color: #ff4a4a;
      text-transform: uppercase;
    }
  }
  .button-wrapper {
    &.pending {
      opacity: 0.5;
      pointer-events: none;
    }
    margin-top: 1.5rem;
    text-align: center;

    width: 400px;
    button {
      margin: 0 0.5rem;
    }
  }

  // CSS for transition from mockup.
  .modal__ico {
    position: relative;
    /* display: inline-block; */
    margin-bottom: 24px;
  }

  .modal__ico-container {
    position: absolute;
    width: 86px;
    height: 86px;
    top: -23px;
    left: 157px;
  }

  .modal__ico-halfclip {
    width: 50%;
    height: 100%;
    right: 0px;
    position: absolute;
    overflow: hidden;
    transform-origin: left center;
    animation: cliprotate 4s steps(2) infinite;
  }

  .modal__ico-halfcircle {
    box-sizing: border-box;
    height: 100%;
    right: 0px;
    position: absolute;
    border: solid 2px transparent;
    border-top-color: #ff4a4a;
    border-left-color: #ff4a4a;
    border-radius: 50%;
  }

  .modal__ico-clipped {
    width: 200%;
    animation: rotate 2s linear infinite;
  }

  .modal__ico-fixed {
    width: 100%;
    transform: rotate(135deg);
    animation: showfixed 4s steps(2) infinite;
  }

  @keyframes cliprotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(-45deg);
    }
    100% {
      transform: rotate(135deg);
    }
  }

  @keyframes showfixed {
    0% {
      opacity: 0;
    }
    49.9% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }
`;

export const SubmitErrorMessage = styled.div`
  color: #ff4a4a;
  font-weight: 600;
  font-size: 0.875rem;
  display: block;
  margin: 0 auto;
  text-align: center;
`;

export const EthTransaction = styled.div`
  margin: 1rem 0;
  text-align: center;
  color: #818180;
  font-size: 0.8rem;

  a {
    text-decoration: underline;
    &:hover {
      color: #ff4a4a;
    }
  }
`;
