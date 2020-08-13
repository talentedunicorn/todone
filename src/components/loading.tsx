import React from "react";
import Styles from "./loading.module.css";

const Loading = () => (
  <div data-testid="Loading" className={Styles.Wrapper}>
    <span className={Styles.Logo}></span>
    <span className="visually-hidden">Loading...</span>
  </div>
);

export default Loading;
