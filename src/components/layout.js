import React from "react";

const Layout = ({ children, headerContent }) => (
  <div data-testid="layout">
    <header>
      <h1 className="Logo">{process.env.REACT_APP_WEBSITE_NAME}</h1>
      {headerContent && <div className="Header-Content">{headerContent}</div>}
    </header>
    {children}
  </div>
);

export default Layout;
