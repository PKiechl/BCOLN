import React from "react";

class NumberField extends React.Component {
  state = { amount: "" };

  onInputChange = async (event) => {
    //sets the entered amount into the state
    //only integers can be entered for now
    await this.setState({ amount: event.target.value.replace(/[^0-9]/g, "") });
    this.props.onFormSubmit(this.props.id, this.state.amount);
    // this.setState({ amount: event.target.value });
  };
  //
  // onFormSubmit = (event) => {
  //   //callback to Bet.js to return the amount that was entered
  //   event.preventDefault();
  //   // this.props.onFormSubmit({nr1: this.state.amount});
  //   this.props.onFormSubmit(this.props.id, this.state.amount);
  // };

  render() {
    // const inputText = "Enter your number";
    return (
      <div className="ui action input">
        <form
          // onSubmit={this.onFormSubmit}
          className="ui form"
        >
          <input
            type="text"
            placeholder="number"
            value={this.state.amount}
            onChange={this.onInputChange}
          />
        </form>
      </div>
    );
  }
}

export default NumberField;
