import React from "react";

class InputBar extends React.Component {
  state = { amount: "" };

  onInputChange = event => {
    this.setState({ amount: event.target.value });
  };

  onFormSubmit = event => {
    event.preventDefault();
    this.props.onFormSubmit(this.state.amount);
  };

  render() {
    return (
      <div className="search bar ui segment">
        <form onSubmit={this.onFormSubmit} className="ui form">
          <label>Bet Amount</label>
          <input
            type="text"
            value={this.state.amount}
            onChange={this.onInputChange}
          />
        </form>
      </div>
    );
  }
}

export default InputBar;
