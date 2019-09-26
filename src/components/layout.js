import React from "react";
import "./layout.css";

const Layout = ({ children, headerContent }) => (
  <div data-testid="layout" className="Layout">
    <header className="Layout-Header">
      <h1 className="Logo">{process.env.REACT_APP_WEBSITE_NAME}</h1>
      {headerContent && <div className="Header-Content">{headerContent}</div>}
    </header>
    {children}
  </div>
);

export default Layout;
