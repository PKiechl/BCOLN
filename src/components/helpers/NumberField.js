import React from "react";

const NumberField = props => {
  const onInputChange = async event => {
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
          value={props.val}
          onChange={onInputChange}
        />
      </form>
    </div>
  );
};

export default NumberField;
