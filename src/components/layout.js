import React from "react";
import Styles from "./layout.module.css";

const Layout = ({ children, headerContent, footerContent }) => (
  <div data-testid="layout">
    <header className={Styles.Header}>
      <h1 className={Styles.Logo}>{process.env.REACT_APP_WEBSITE_NAME}</h1>
      {headerContent && (
        <div className={Styles.HeaderContent}>{headerContent}</div>
      )}
    </header>
    {children}
    {footerContent && (
      <footer className={Styles.Footer}>{footerContent}</footer>
    )}
  </div>
);

export default Layout;
