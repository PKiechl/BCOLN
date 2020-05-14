import React from "react";

const Spinner = props => {
  console.log("spinner: ", props.hide);
  console.log("spinner: ", props.unhide);

  if (!props.hide || props.unhide) {
    return <div />;
  } else {
    return (
      <div className="ui active dimmer">
        <div className="ui text loader">Searching for the roulette ball...</div>
      </div>
    );
  }
};

export default Spinner;
