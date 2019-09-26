import React from "react";
import "./layout.css";

const Layout = ({ children, headerContent, footerContent }) => (
  <div data-testid="layout" className="Layout">
    <header className="Layout-Header">
      <h1 className="Logo">{process.env.REACT_APP_WEBSITE_NAME}</h1>
      {headerContent && <div className="Header-Content">{headerContent}</div>}
    </header>
    {children}
    {footerContent && (
      <footer className="Layout-Footer">{footerContent}</footer>
    )}
  </div>
);

export default Layout;
