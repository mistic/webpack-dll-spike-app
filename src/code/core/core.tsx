import * as React from "react";
import "styles/core.scss";
import { Printer } from "code/sdk";

const reactLogo = require("assets/images/react_logo.svg");

export class Core extends React.Component {
  componentDidMount() {
    Printer.green("Core component has been mounted.");
  }

  render() {
    return (
      <div id="core">
        <h1>Hello!</h1>
        <p>I am the a react core component.</p>
        <img src={reactLogo} height="600"/>
      </div>
    );
  }
}
