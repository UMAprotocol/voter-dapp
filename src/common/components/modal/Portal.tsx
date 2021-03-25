import { FC, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

// Although Portals are more generic, this seems very tied to the Modal component.
// So let's keep them together.
function resolveRoot() {
  const existingRoot = document.getElementById("portal-root");
  if (existingRoot) {
    return existingRoot;
  }
  const root = document.createElement("div");
  root.setAttribute("id", "portal-root");
  return document.body.appendChild(root);
}

const Portal: FC = ({ children }) => {
  const [root] = useState(resolveRoot);
  const [container] = useState(() => {
    return document.createElement("div");
  });

  useLayoutEffect(() => {
    root.appendChild(container);

    return () => {
      root.removeChild(container);
      if (root.childNodes.length === 0) {
        root.parentElement?.removeChild(root);
      }
    };
  }, [container, root]);

  return ReactDOM.createPortal(children, container);
};

export default Portal;
