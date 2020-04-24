import React from "react";
import NumberField from "./NumberField";

class Bets extends React.Component {
  state = {
    type: null,
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

    if(this.validateNumbers()) {
      await this.props.onClick(
        type,
        this.state.nr1,
        this.state.nr2,
        this.state.nr3,
        this.state.nr4
      );
      // bet successful TODO: might need better checking
      this.resetState();
    }
  };

  resetState = async () => {
    // reset state to properly change the ui for consecutive bets when using
    // place another bet in App.js
    await this.setState({type: null});
    await this.setState({nr1: ""});
    await this.setState({nr2: ""});
    await this.setState({nr3: ""});
    await this.setState({nr4: ""});
    await this.setState({ready: false});
  };

  numberCountCheck = () => {
    console.log("numerical bet type:", this.state.type);
    // check if the necessary amount of numbers per betType are set
    // also checks upon changing betType and resets ready state if needed
    if (this.state.type === "1num") {
      if (this.state.nr1 !== "") {
        this.setState({ ready: true });
      } else {
        this.setState({ ready: false });
      }
    }
    if (this.state.type === "2combo") {
      if (this.state.nr1 !== "" && this.state.nr2 !== "") {
        this.setState({ ready: true });
      } else {
        this.setState({ ready: false });
      }
    }
    if (this.state.type === "4combo") {
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

  singleNumCheck = () => {
    // check validity of a simple numerical bet
    if (this.state.type === "1num") {
      if (this.state.nr1 < 0 || this.state.nr1 > 36) {
        alert("Invalid Number entered. Please enter a numbers from 0 to 36!");
        this.setState({nr1: ""});
        return false;
      }
    }
    return true;
  };

  twoComboCheck = () => {
    // check validity of a 2 combo numerical bet
    if (this.state.type === "2combo") {
      // individual validity checks
      if (this.state.nr1 > 36 || this.state.nr1 < 1) {
        alert("Please enter a number between 1 and 36 for your first number!");
        this.setState({nr1: ""});
        return false;
      }
      if (this.state.nr2 > 36 || this.state.nr2 < 1) {
        alert("Please enter a number between 1 and 36 for your second number!");
        this.setState({nr2: ""});
        return false;
      }
      // TODO: valid combo logic... would require actual roulette field in UI
      //  otherwise how is the user to know which combos are valid
    }
    return true;
  };

  fourComboCheck = () => {
    if (this.state.type === "4combo") {
      // individual validity checks
      if (this.state.nr1 > 36 || this.state.nr1 < 1) {
        alert("Please enter a number between 1 and 36 for your first number!");
        this.setState({nr1: ""});
        return false;
      }
      if (this.state.nr2 > 36 || this.state.nr2 < 1) {
        alert("Please enter a number between 1 and 36 for your second number!");
        this.setState({nr2: ""});
        return false;
      }
      if (this.state.nr3 > 36 || this.state.nr3 < 1) {
        alert("Please enter a number between 1 and 36 for your third number!");
        this.setState({nr3: ""});
        return false;
      }
      if (this.state.nr4 > 36 || this.state.nr4 < 1) {
        alert("Please enter a number between 1 and 36 for your fourth number!");
        this.setState({nr4: ""});
        return false;
      }
    }
    // TODO: valid combo logic... would require actual roulette field in UI
    //  otherwise how is the user to know which combos are valid
    return true;
  };

  validateNumbers = () => {
    // checks if numerical bets adhere to the rules of the game
    return this.singleNumCheck() && this.twoComboCheck() && this.fourComboCheck();
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
    if (this.state.type === "4combo") {
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
    if (this.state.type === "2combo") {
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
    if (this.state.type === "1num") {
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
          onClick={() => this.onSubmit("even")}
        >
          betEven
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.onSubmit("odd")}
        >
          betOdd
        </button>
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
          onClick={async () => {
            await this.setState({ type: "1num" });
            this.numberCountCheck();
          }}
        >
          bet 1 Number
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={async () => {
            await this.setState({ type: "2combo" });
            this.numberCountCheck();
          }}
        >
          bet 2 combo
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={async () => {
            await this.setState({ type: "4combo" });
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
