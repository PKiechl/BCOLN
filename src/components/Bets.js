import React from "react";

class Bets extends React.Component {
  onSubmit = type => {
    this.props.onClick(type);
  };

  render() {
    //TODO: add more bet buttons here
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
      </div>
    );
  }
}

export default Bets;
