import React from "react";
import NumberField from "../NumberField";
import { Button, Header, Icon } from "semantic-ui-react";
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal";

class BetsLeft extends React.Component {
  state = {
    type: null,
    nr1: "",
    nr2: "",
    nr3: "",
    nr4: "",
    ready: false,
    open: false
  };

  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  onSubmit = async type => {
    // the bet with the type specified on the selected button is "returned" to the app
    // the numbers come form the NumberFields and are handled by the receiver function
    await console.log(
      this.state.nr1,
      this.state.nr2,
      this.state.nr3,
      this.state.nr4
    );

    if (this.validateNumbers()) {
      await this.props.onClick(
        type,
        this.state.nr1,
        this.state.nr2,
        this.state.nr3,
        this.state.nr4
      );
      this.close();
      // bet successful TODO: might need better checking
      this.resetState();
    }
  };


  resetState = async () => {
    // reset state to properly change the ui for consecutive bets when using
    // place another bet in App.js
    await this.setState({ type: null });
    await this.setState({ nr1: "" });
    await this.setState({ nr2: "" });
    await this.setState({ nr3: "" });
    await this.setState({ nr4: "" });
    await this.setState({ ready: false });
  };

  numberCountCheck = () => {
    console.log("numerical bet type:", this.state.type);
    // check if the necessary amount of numbers per betType are set
    // also checks upon changing betType and resets ready state if needed
    if (this.state.type === "1nr") {
      if (this.state.nr1 !== "") {
        this.setState({ ready: true });
      } else {
        this.setState({ ready: false });
      }
    }
    if (this.state.type === "2nr") {
      if (this.state.nr1 !== "" && this.state.nr2 !== "") {
        this.setState({ ready: true });
      } else {
        this.setState({ ready: false });
      }
    }
    if (this.state.type === "4nr") {
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
    if (this.state.type === "1nr") {
      if (this.state.nr1 < 0 || this.state.nr1 > 36) {
        alert("Invalid Number entered. Please enter a numbers from 0 to 36!");
        this.setState({ nr1: "" });
        return false;
      }
    }
    return true;
  };

  twoComboCheck = () => {
    // check validity of a 2 combo numerical bet
    if (this.state.type === "2nr") {
      // individual validity checks
      if (this.state.nr1 > 36 || this.state.nr1 < 1) {
        alert("Please enter a number between 1 and 36 for your first number!");
        this.setState({ nr1: "" });
        return false;
      }
      if (this.state.nr2 > 36 || this.state.nr2 < 1) {
        alert("Please enter a number between 1 and 36 for your second number!");
        this.setState({ nr2: "" });
        return false;
      }
      // TODO: valid combo logic... would require actual roulette field in UI
      //  otherwise how is the user to know which combos are valid
    }
    return true;
  };

  fourComboCheck = () => {
    if (this.state.type === "4nr") {
      // individual validity checks
      if (this.state.nr1 > 36 || this.state.nr1 < 1) {
        alert("Please enter a number between 1 and 36 for your first number!");
        this.setState({ nr1: "" });
        return false;
      }
      if (this.state.nr2 > 36 || this.state.nr2 < 1) {
        alert("Please enter a number between 1 and 36 for your second number!");
        this.setState({ nr2: "" });
        return false;
      }
      if (this.state.nr3 > 36 || this.state.nr3 < 1) {
        alert("Please enter a number between 1 and 36 for your third number!");
        this.setState({ nr3: "" });
        return false;
      }
      if (this.state.nr4 > 36 || this.state.nr4 < 1) {
        alert("Please enter a number between 1 and 36 for your fourth number!");
        this.setState({ nr4: "" });
        return false;
      }
    }
    // TODO: valid combo logic... would require actual roulette field in UI
    //  otherwise how is the user to know which combos are valid
    return true;
  };

  validateNumbers = () => {
    // checks if numerical bets adhere to the rules of the game
    return (
      this.singleNumCheck() && this.twoComboCheck() && this.fourComboCheck()
    );
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
    const { open } = this.state;

    let numField = null;
    if (this.state.type === "4nr") {
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
            <Button
              color="green"
              disabled={!this.state.ready}
              className="ui button"
              onClick={() => this.onSubmit("4nr")}
            >
              <Icon name="right chevron" />
              submit numbers
            </Button>
          </div>
        </div>
      );
    }
    if (this.state.type === "2nr") {
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
            <Button
              color="green"
              disabled={!this.state.ready}
              className="ui button"
              onClick={() => this.onSubmit("2nr")}
            >
              <Icon name="right chevron" />
              submit numbers
            </Button>
          </div>
        </div>
      );
    }
    if (this.state.type === "1nr") {
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
            <Button
              color="green"
              disabled={!this.state.ready}
              className="ui button"
              onClick={() => this.onSubmit("1nr")}
            >
              <Icon name="right chevron" />
              submit numbers
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            width: "45%",
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
            onClick={() => this.onSubmit("1-18")}
            style={{ marginBottom: "15px" }}
          >
            1-18
          </button>
          <button
            className="ui button"
            disabled={this.props.disabled}
            onClick={() => this.onSubmit("19-36")}
            style={{ marginBottom: "15px" }}
          >
            19-36
          </button>
          <Modal
            open={open}
            onOpen={this.open}
            onClose={this.close}
            size="small"
            trigger={
              <button className="ui button" disabled={this.props.disabled}>
                NUMBERS <Icon name="right chevron" />
              </button>
            }
          >
            <Header>
              <Icon name="edit" />
              Bet on Numbers
            </Header>
            <Modal.Content style={{ height: "150px" }}>
              <button
                className="ui button"
                disabled={this.props.disabled}
                onClick={async () => {
                  await this.setState({ type: "1nr" });
                  this.numberCountCheck();
                }}
              >
                1NR
              </button>
              <button
                className="ui button"
                disabled={this.props.disabled}
                onClick={async () => {
                  await this.setState({ type: "2nr" });
                  this.numberCountCheck();
                }}
              >
                2NR
              </button>
              <button
                className="ui button"
                disabled={this.props.disabled}
                onClick={async () => {
                  await this.setState({ type: "4nr" });
                  this.numberCountCheck();
                }}
              >
                4NR
              </button>
              {numField}
            </Modal.Content>
          </Modal>
        </div>
      </div>
    );
  }
}

export default BetsLeft;
