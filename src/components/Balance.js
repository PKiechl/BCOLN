import React from "react";

const Balance = props => {
  return (
    <div>
      <div className="right menu">Balance: {props.eths}</div>

      <div className="right menu">Address: {props.address}</div>
    </div>
  );
};
export default Balance;
