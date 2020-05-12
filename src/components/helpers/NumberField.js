import React from "react";

const NumberField = (props) => {
  /*
  component accepts numerical user input and sets it to state of parent component
   */
  const onInputChange = async (event) => {
    // send any changes immediately up the the state of BetsLeft.js
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
