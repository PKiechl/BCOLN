import React from "react";
import NumberField from "./NumberField";

class Bets extends React.Component {
  state = { multi: null, nr1: null, nr2: null, nr3: null, nr4: null };

  onSubmit = async (type) => {
    //returns to App
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

  receiver = async (id, num) => {
    // set received number into appropriate state
    console.log(id, num);
    if (id === 1) {
      await this.setState({ nr1: num });
    } else if (id === 2) {
      await this.setState({ nr2: num });
    } else if (id === 3) {
      await this.setState({ nr3: num });
    } else {
      await this.setState({ nr4: num });
    }

    console.log(this.state.nr1, this.state.nr2, this.state.nr3, this.state.nr4);
  };

  render() {
    //TODO: add more bet buttons here

    let numField = null;
    if (this.state.multi === "4combo") {
      numField = (
        <div>
          <div>
            <NumberField onFormSubmit={this.receiver} id={1} />
            <NumberField onFormSubmit={this.receiver} id={2} />
            <NumberField onFormSubmit={this.receiver} id={3} />
            <NumberField onFormSubmit={this.receiver} id={4} />
          </div>
          <div>
            <button
              className="ui button"
              onClick={() => this.onSubmit("2combo")}
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
            <NumberField onFormSubmit={this.receiver} id={1} />
            <NumberField onFormSubmit={this.receiver} id={2} />
          </div>
          <div>
            <button
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
            <NumberField onFormSubmit={this.receiver} id={1} />
          </div>
          <div>
            <button className="ui button" onClick={() => this.onSubmit("1num")}>
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
          onClick={() => this.setState({ multi: "1num" })}
        >
          bet 1 Number
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.setState({ multi: "2combo" })}
        >
          bet 2 combo
        </button>
        <button
          className="ui button"
          disabled={this.props.disabled}
          onClick={() => this.setState({ multi: "4combo" })}
        >
          bet 4 combo
        </button>
        {numField}
      </div>
    );
  }
}

export default Bets;
