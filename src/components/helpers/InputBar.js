import React from "react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/index";

class InputBar extends React.Component {
  state = { amount: "" };

  onInputChange = (event) => {
    //sets the entered amount into the state
    this.setState({ amount: event.target.value });
  };

  onFormSubmit = (event) => {
    //callback to App.js to return the amount that was entered
    event.preventDefault();
    this.props.onFormSubmit(this.state.amount);
  };

  render() {
    return (
      <div className="search bar ui segment">
        <form onSubmit={this.onFormSubmit} className="ui form">
          <label> {this.props.inputText} </label>
          <input
            type="text"
            placeholder={this.props.altText}
            value={this.state.amount}
            onChange={this.onInputChange}
            disabled={this.props.disabled}
          />
          <Button
            disabled={this.props.disabled}
            color="black"
            style={{ marginTop: "5px" }}
          >
            CONFIRM
          </Button>
        </form>
      </div>
    );
  }
}

export default InputBar;
