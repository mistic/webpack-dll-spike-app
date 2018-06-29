import * as React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Core } from "./core";

const rootEl = document.getElementById("root");

render(
  <AppContainer>
    <Core/>
  </AppContainer>,
  rootEl
);

// Hot Module Replacement API
declare let module: { hot: any };

if (module.hot) {
  module.hot.accept("./core", () => {
    const NewCore = require("./core").Core;

    render(
      <AppContainer>
        <NewCore/>
      </AppContainer>,
      rootEl
    );
  });
}
