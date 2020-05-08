import React from "react";
import NumberField from "../NumberField";

class Bets extends React.Component {
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
    await this.props.onClick(
      type,
      this.state.nr1,
      this.state.nr2,
      this.state.nr3,
      this.state.nr4
    );
    // bet successful TODO: might need better checking
    this.resetState();
  };

  resetState = async () => {
    // reset state to properly change the ui for consecutive bets when using
    // place another bet in App.js
    await this.setState({ type: null });
    await this.setState({ ready: false });
  };

  render() {
    return (
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          width: "50%",
          marginLeft: "0",
          marginRight: "auto"
        }}
      >
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("black")}
          style={{ marginBottom: "15px" }}
        >
          BLACK
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("red")}
          style={{ marginBottom: "15px" }}
        >
          RED
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("even")}
          style={{ marginBottom: "15px" }}
        >
          EVEN
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("odd")}
          style={{ marginBottom: "15px" }}
        >
          ODD
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("1to18")}
          style={{ marginBottom: "15px" }}
        >
          1-18
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("19to36")}
          style={{ marginBottom: "15px" }}
        >
          19-36
        </button>
      </div>
    );
  }
}

export default Bets;
