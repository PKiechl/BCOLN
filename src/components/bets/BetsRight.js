import React from "react";

class BetsRight extends React.Component {
  /*
this class contains the buttons corresponding to the bets displayed on the
right side of the UI, as well as the logic required to send the picked bet
type to the parent component (GamePage)
 */
  state = {
    type: null,
    nr1: "",
    nr2: "",
    nr3: "",
    nr4: "",
    ready: false,
  };

  onSubmit = async (type) => {
    // the bet with the type specified on the selected button is "returned" to the GamePage
    await this.props.onClick(
      type,
      this.state.nr1,
      this.state.nr2,
      this.state.nr3,
      this.state.nr4
    );
    this.resetState();
  };

  resetState = async () => {
    // reset state to properly change the ui for consecutive bets when using
    // place another bet in GamePage.js
    await this.setState({ type: null });
    await this.setState({ ready: false });
  };

  render() {
    return (
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          width: "45%",
          marginLeft: "auto",
          marginRight: "0",
        }}
      >
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("1st 12")}
          style={{ marginBottom: "15px" }}
        >
          1ST 12
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("2nd 12")}
          style={{ marginBottom: "15px" }}
        >
          2ND 12
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("3rd 12")}
          style={{ marginBottom: "15px" }}
        >
          3RD 12
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("1st column")}
          style={{ marginBottom: "15px" }}
        >
          1ST COLUMN
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("2nd column")}
          style={{ marginBottom: "15px" }}
        >
          2ND COLUMN
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("3rd column")}
          style={{ marginBottom: "15px" }}
        >
          3RD COLUMN
        </button>
      </div>
    );
  }
}

export default BetsRight;
