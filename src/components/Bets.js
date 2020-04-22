import React from "react";

class Bets extends React.Component {
  state = { multi: false, nr1: null, nr2: null, nr3: null, nr4: null };

  onSubmit = type => {
    //returns to App
    this.props.onClick(
      type,
      this.state.nr1,
      this.state.nr2,
      this.state.nr3,
      this.state.nr4
    );
  };

  render() {
    //TODO: add more bet buttons here

    let numField = null;
    if (this.state.multi) {
      numField = (
        <div>
          <input onSubmit={this.setMultiNr} />
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
          onClick={() => this.setState({ multi: true })}
        >
          betMulti
        </button>
        {numField}
      </div>
    );
  }
}

export default Bets;
