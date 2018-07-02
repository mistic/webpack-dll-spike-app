import * as React from "react";
import * as Highcharts from "highcharts/highstock";
import { Printer } from "code/sdk";
import * as coreStyle from "styles/core/core.scss";

const reactLogo = require("assets/images/react_logo.svg");

type ChartProps = {
  options: any,
  type?: any
};

type ChartState = {};

class Chart extends React.Component<ChartProps, ChartState> {
  private readonly chartContainer: any;
  private chart: any;

  constructor(props) {
    super(props);
    this.chartContainer = React.createRef();
  }

  componentDidMount() {
    this.chart = new Highcharts[this.props.type || "Chart"](
      this.chartContainer.current,
      this.props.options
    );
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    return <div ref={this.chartContainer} />;
  }
}

type CoreProps = {};

type CoreState = {
  chartOptions: Object
};

export class Core extends React.Component<CoreProps, CoreState> {
  public readonly state: CoreState = {
    chartOptions: {
      title: {
        text: "Fruit Consumption",
      },
      xAxis: {
        categories: [
          "Apples",
          "Bananas",
          "Oranges",
          "Pineapples",
          "Blueberries",
        ],
      },
      yAxis: {
        title: {
          text: "Fruit eaten",
        },
      },
      chart: {
        type: "line",
      },
      series: [
        {
          name: "Jane",
          data: [1, 0, 4, 0, 3],
        },
        {
          name: "John",
          data: [5, 7, 3, 2, 4],
        },
        {
          name: "Doe",
          data: [0, 0, 0, 1, 0],
        }
      ]
    }
  };

  public componentDidMount() {
    Printer.green("Core component has been mounted.");
  }

  public render() {
    return (
      <div className={coreStyle.core}>
        <h1>Hello!</h1>
        <p>I am the a react core component.</p>
        <img src={reactLogo} height="600"/>
        <Chart options={ this.state.chartOptions } />
      </div>
    );
  }
}
