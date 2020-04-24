import React from "react";

const NumberField = (props) => {
  /* TODO: i attempted to set up some form of two-way binding for the case where
   *   you change betType from a "larger" to a "smaller" e.g. 2combo to 1num,
   *   but have already entered numbers. the nubmers are still retained in the
   *   state of Bet.js, BUT they no longer show in the form.
   *   Options:
   *   a) use this.props.init as placeholder, works but kinda meh since then greyed out
   *   b) clear the state in Bets.js, thus clearing the value in the NumberField,
   *   requires transforming into functional component AND will result in a Warning
   *   about controlled/uncontrolled input-field BUT it works...
   */

  const onInputChange = async (event) => {
    // send any changes immediately up the the state of Bets.js
    let temp = event.target.value.replace(/[^0-9]/g, "");
    props.onFormSubmit(props.id, temp);
  };

  return (
    <div className="ui action input">
      <form className="ui form">
        <input
          type="text"
          placeholder="number"
          // placeholder = {this.props.init}
          value={props.val}
          onChange={onInputChange}
        />
      </form>
    </div>
  );
};

// class NumberField extends React.Component {
//   state = { amount: "" };
//
//   /* TODO: I decided to keep the old code for now --- just in case
//
//
//   onInputChange = async (event) => {
//     //sets the entered amount into the state, only integers can be entered for now
//     //any changes are immediately set to state and then passed up to the receiver in Bets.js
//     await this.setState({ amount: event.target.value.replace(/[^0-9]/g, "") });
//     this.props.onFormSubmit(this.props.id, this.state.amount);
//   };
//
//
//   render() {
//     return (
//       <div className="ui action input">
//         <form
//           className="ui form"
//         >
//           <input
//             type="text"
//             placeholder="number"
//             // placeholder = {this.props.init}
//             value={this.state.amount}
//             onChange={this.onInputChange}
//           />
//         </form>
//       </div>
//     );
//   }
// }

export default NumberField;
