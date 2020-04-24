import React from "react";
import NumberField from "./NumberField";

class Bets extends React.Component {
  state = {
    multi: null,
    nr1: "",
    nr2: "",
    nr3: "",
    nr4: "",
    ready: false,
  };

  // resetNumbers = async () => {
  //   // TODO: KEEP THIS - if we want to clear the fields when changing numerical bet types we need this -> also call from onClick on betButtons
  //   // clears the state if the type of numerical bet is changed by clicking the
  //   // corresponding button
  //   await this.setState({ nr1: "" });
  //   await this.setState({ nr2: "" });
  //   await this.setState({ nr3: "" });
  //   await this.setState({ nr4: "" });
  // };

  onSubmit = async (type) => {
    // the bet with the type specified on the selected button is "returned" to the app
    // the numbers come form the NumberFields and are handled by the receiver function
    await console.log(
      this.state.nr1,
      this.state.nr2,
      this.state.nr3,
      this.state.nr4
    );

    await this.props.onClick(
      type,
      this.state.nr1,
      this.state.nr2,
      this.state.nr3,
      this.state.nr4
    );
  };

  numberCountCheck = () => {
    console.log("numerical bet type:", this.state.multi);
    // check if the necessary amount of numbers per betType are set
    // also checks upon changing betType and resets ready state if needed
    if (this.state.multi === "1num") {
      if (this.state.nr1 !== "") {
        this.setState({ ready: true });
      } else {
        this.setState({ ready: false });
      }
    }
    if (this.state.multi === "2combo") {
      if (this.state.nr1 !== "" && this.state.nr2 !== "") {
        this.setState({ ready: true });
      } else {
        this.setState({ ready: false });
      }
    }
    if (this.state.multi === "4combo") {
      if (
        this.state.nr1 !== "" &&
        this.state.nr2 !== "" &&
        this.state.nr3 !== "" &&
        this.state.nr4 !== ""
      ) {
        this.setState({ ready: true });
      } else {
        this.setState({ ready: false });
      }
    }
  };

  receiver = async (id, num) => {
    // set received number into appropriate state
    console.log("field-id:", id, "field-content:", num);
    if (id === 1) {
      await this.setState({ nr1: num });
    } else if (id === 2) {
      await this.setState({ nr2: num });
    } else if (id === 3) {
      await this.setState({ nr3: num });
    } else {
      await this.setState({ nr4: num });
    }
    this.numberCountCheck();
    console.log(this.state.nr1, this.state.nr2, this.state.nr3, this.state.nr4);
  };

  render() {
    //TODO: add more bet buttons here

    let numField = null;
    if (this.state.multi === "4combo") {
      numField = (
        <div>
          <div>
            <NumberField
              onFormSubmit={this.receiver}
              id={1}
              val={this.state.nr1}
            />
            <NumberField
              onFormSubmit={this.receiver}
              id={2}
              val={this.state.nr2}
            />
            <NumberField
              onFormSubmit={this.receiver}
              id={3}
              val={this.state.nr3}
            />
            <NumberField
              onFormSubmit={this.receiver}
              id={4}
              val={this.state.nr4}
            />
          </div>
          <div>
            <button
              disabled={!this.state.ready}
              className="ui button"
              onClick={() => this.onSubmit("4combo")}
            >
              submit numbers
            </button>
          </div>
        </div>
      );
    }
    if (this.state.multi === "2combo") {
      numField = (
        <div>
          <div>
            <NumberField
              onFormSubmit={this.receiver}
              id={1}
              val={this.state.nr1}
            />
            <NumberField
              onFormSubmit={this.receiver}
              id={2}
              val={this.state.nr2}
            />
          </div>
          <div>
            <button
              disabled={!this.state.ready}
              className="ui button"
              onClick={() => this.onSubmit("2combo")}
            >
              submit numbers
            </button>
          </div>
        </div>
      );
    }
    if (this.state.multi === "1num") {
      numField = (
        <div>
          <div>
            <NumberField
              onFormSubmit={this.receiver}
              id={1}
              val={this.state.nr1}
            />
          </div>
          <div>
            <button
              disabled={!this.state.ready}
              className="ui button"
              onClick={() => this.onSubmit("1num")}
            >
              submit numbers
            </button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("black")}
        >
          betBlack
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("red")}
        >
          betRed
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={async () => {
            await this.setState({ multi: "1num" });
            this.numberCountCheck();
          }}
        >
          bet 1 Number
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={async () => {
            await this.setState({ multi: "2combo" });
            this.numberCountCheck();
          }}
        >
          bet 2 combo
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={async () => {
            await this.setState({ multi: "4combo" });
            this.numberCountCheck();
          }}
        >
          bet 4 combo
        </button>
        {numField}
      </div>
    );
  }
}

export default Bets;
