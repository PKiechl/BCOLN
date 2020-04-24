import React from "react";

class InputBar extends React.Component {
  state = { amount: "" };

  onInputChange = event => {
    //sets the entered amount into the state
    //only integers can be entered for now
    // this.setState({ amount: event.target.value.replace(/[^0-9.]/g, "") });
    this.setState({ amount: event.target.value });
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
          <label> {this.props.inputText} </label>
          <input
            type="text"
            value={this.state.amount}
            onChange={this.onInputChange}
          />
          <button className="ui button" disabled={this.props.disabled}>
            Confirm
          </button>
        </form>
      </div>
    );
  }
}


// // TODO: NOTE: experimented with a functional component version but screws with alot
// const InputBar = (props) => {
//
//   const onInputChange = event => {
//     //sets the entered amount into the state
//     let temp = event.target.value;
//     // NOTE: not sure what it means when he says props.onFormSubmit not resolved,
//     //  it works after all...
//     //  same for props.inputText on line 18
//     props.onFormSubmit(temp);
//   };
//
//   return (
//     <div className="search bar ui segment">
//       <form
//         className="ui form">
//         <label> {props.inputText} </label>
//         <input
//           type="text"
//           value={props.val}
//           onChange={onInputChange}
//         />
//       </form>
//     </div>
//   );
// };


export default InputBar;
