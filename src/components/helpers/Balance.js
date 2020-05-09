import React from "react";

const Balance = props => {
  return (
    <div>
      <div className="right menu">balance: {props.eths}</div>
      <div className="right menu">address: {props.address}</div>
    </div>
  );
};
export default Balance;
