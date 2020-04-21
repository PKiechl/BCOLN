import React from "react";

class Bets extends React.Component {
  onSubmit = type => {
    this.props.onClick(type);
  };

  render() {
      //TODO: add more buttons here
    return (
      <div>
        <button className="ui button" onClick={() => this.onSubmit("black")}>
          betBlack
        </button>
        <button className="ui button" onClick={() => this.onSubmit("red")}>
          betRed
        </button>
      </div>
    );
  }
}

export default Bets;
