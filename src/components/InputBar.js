import React from "react";

class InputBar extends React.Component {
  state = { amount: "" };

  onInputChange = event => {
    //sets the entered amount into the state
    //only integers can be entered for now
    //todo: change validation to include decimals as well, spending full ETH's is "too expensive"
    this.setState({ amount: event.target.value.replace(/[^0-9]/g, "") });
  };

  onFormSubmit = event => {
    //callback to App.js to return the amount that was entered
    event.preventDefault();
    this.props.onFormSubmit(this.state.amount);
  };

  render() {
    return (
      <div className="search bar ui segment">
        <form onSubmit={this.onFormSubmit} className="ui form">
          <label>Bet Amount (input integers only (for now)) </label>
          <input
            type="text"
            value={this.state.amount}
            onChange={this.onInputChange}
          />
          <button className="ui button">Confirm</button>
        </form>
      </div>
    );
  }
}

export default InputBar;
