import React from "react";
import { Redirect } from "react-router-dom";
import { web3 } from "../../service/Service";

//if address is valid, redirect to the GamePage
//else redirect back to joinPage
export const GameGuard = props => {
  if (web3.utils.isAddress(props.address)) {
    return props.children;
  } else if (!props.joined) {
    return <Redirect to={"/"} />;
  } else if (props.address === null) {
    return <div />;
  } else {
    return <Redirect to={"/"} />;
  }
};
