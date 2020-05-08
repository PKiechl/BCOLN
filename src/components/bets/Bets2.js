import React from "react";
import NumberField from "../NumberField";

class Bets2 extends React.Component {
  state = {
    type: null,
    nr1: "",
    nr2: "",
    nr3: "",
    nr4: "",
    ready: false
  };



  onSubmit = async type => {
    // the bet with the type specified on the selected button is "returned" to the app
    // the numbers come form the NumberFields and are handled by the receiver function

    // if (this.validateNumbers()) {
    await this.props.onClick(
      type,
      this.state.nr1,
      this.state.nr2,
      this.state.nr3,
      this.state.nr4
    );
    // bet successful TODO: might need better checking
    this.resetState();
    // }
  };

  resetState = async () => {
    // reset state to properly change the ui for consecutive bets when using
    // place another bet in App.js
    await this.setState({ type: null });
    await this.setState({ ready: false });
  };

  render() {
    return (
      <div style={{ flexDirection: "column", display: "flex", width: "50%", marginLeft:"auto", marginRight:"0"}}>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("firstDozen")}
        >
          betFirstDozen
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("secondDozen")}
        >
          betSecondDozen
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("thirdDozen")}
        >
          betThirdDozen
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("col1")}
        >
          betCol1
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("col2")}
        >
          betCol2
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("col3")}
        >
          betCol3
        </button>
      </div>
    );
  }
}

export default Bets2;
