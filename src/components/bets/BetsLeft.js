import React from "react";
import NumberField from "../helpers/NumberField";
import { Button, Header, Icon } from "semantic-ui-react";
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal";

class BetsLeft extends React.Component {
  /*
  this component contains the buttons corresponding to the bets displayed on the
  left side of the UI, as well as the logic required to send the picked bet
  type and additional information like numbers picked to the parent component (GamePage)
   */
  state = {
    type: null,
    nr1: "",
    nr2: "",
    nr3: "",
    nr4: "",
    ready: false,
    open: false,
  };

  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  onSubmit = async (type) => {
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
      this.resetState();
    }
  };

  resetState = async () => {
    // reset state to properly change the ui for consecutive bets when using
    // place another bet in GamePage.js
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
        this.setState({ nr2: "", nr3: "", nr4: "" });
      } else {
        this.setState({ ready: false });
      }
    }
    if (this.state.type === "2nr") {
      if (this.state.nr1 !== "" && this.state.nr2 !== "") {
        this.setState({ ready: true });
        this.setState({ nr3: "", nr4: "" });
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
    // 0 allowed as single bet
    if (this.state.nr1 < 0 || this.state.nr1 > 36) {
      alert("Invalid Number entered. Please enter a numbers from 0 to 36!");
      this.setState({ nr1: "" });
      return false;
    }
    return true;
  };

  twoComboCheck = () => {
    // check whether the individual numbers adhere to the available range of numbers
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
    if (this.state.nr1 === this.state.nr2) {
      alert("Please bet on distinct numbers!");
      return false;
    }
    return true;
  };

  fourComboCheck = () => {
    // check whether the individual numbers adhere to the available range of numbers
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
    if (
      this.state.nr3 === this.state.nr4 ||
      this.state.nr1 === this.state.nr3 ||
      this.state.nr1 === this.state.nr4 ||
      this.state.nr2 === this.state.nr3 ||
      this.state.nr2 === this.state.nr4 ||
      this.state.nr1 === this.state.nr2
    ) {
      alert("Please bet on distinct numbers!");
      return false;
    }
    return true;
  };

  validate2combo = () => {
    /*
    validate whether a given combination is adhering to the rules of the game,
    aka. if they are adjacent
    */
    let betsSorted = [this.state.nr1, this.state.nr2];
    betsSorted.sort((a, b) => a - b);
    this.setState({
      nr1: betsSorted[0],
      nr2: betsSorted[1],
    });
    console.log(betsSorted[0]);
    console.log(betsSorted[1]);

    if (
      parseInt(betsSorted[0]) % 3 === 0 &&
      parseInt(betsSorted[1]) !== parseInt(betsSorted[0]) + 3
    ) {
      alert("Please enter a valid combination of numbers");
      return false;
    }
    if (
      parseInt(betsSorted[0]) + 1 !== parseInt(betsSorted[1]) &&
      parseInt(betsSorted[0]) + 3 !== parseInt(betsSorted[1])
    ) {
      alert("Please enter a valid combination of numbers");
      return false;
    } else {
      console.log("validate4combo valid");
      return true;
    }
  };

  validate4combo = () => {
    /*
    validate whether a given combination is adhering to the rules of the game,
    aka. if they are adjacent
    */
    console.log("validate4combo");
    let bets1 = [
      this.state.nr1,
      this.state.nr2,
      this.state.nr3,
      this.state.nr4,
    ];
    let betsSorted = bets1.sort((a, b) => a - b);
    this.setState({
      nr1: betsSorted[0],
      nr2: betsSorted[1],
      nr3: betsSorted[2],
      nr4: betsSorted[3],
    });

    if (parseInt(betsSorted[0]) % 3 === 0) {
      alert("Please enter a valid combination of numbers");
      return false;
    } else if (
      parseInt(betsSorted[0]) + 1 === parseInt(betsSorted[1]) &&
      parseInt(betsSorted[0]) + 3 === parseInt(betsSorted[2]) &&
      parseInt(betsSorted[0]) + 4 === parseInt(betsSorted[3])
    ) {
      console.log("validate4combo valid");
      return true;
    } else {
      alert("Please enter a valid combination of numbers");
      return false;
    }
  };

  validateNumbers = () => {
    // checks if numerical bets adhere to the rules of the game
    if (this.state.type === "4nr") {
      if (this.fourComboCheck()) {
        console.log("4combocheck valid");
        return this.validate4combo();
      } else return false;
    }
    if (this.state.type === "2nr") {
      if (this.twoComboCheck()) {
        return this.validate2combo();
      } else return false;
    }
    if (this.state.type === "1nr") {
      return this.singleNumCheck();
    }
    return true;
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
    /*
    change the numField that is being rendered depending on the type of
    numerical bet selected
    */
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
              color="black"
              disabled={!this.state.ready}
              className="ui button"
              onClick={() => this.onSubmit("4nr")}
            >
              SUBMIT
              <Icon name="right chevron" />
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
              color="black"
              disabled={!this.state.ready}
              className="ui button"
              onClick={() => this.onSubmit("2nr")}
            >
              SUBMIT
              <Icon name="right chevron" />
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
              color="black"
              disabled={!this.state.ready}
              className="ui button"
              onClick={() => this.onSubmit("1nr")}
            >
              SUBMIT
              <Icon name="right chevron" />
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
            marginRight: "auto",
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
            size="large"
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
