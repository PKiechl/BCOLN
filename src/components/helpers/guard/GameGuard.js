import React from "react";
import { Redirect } from "react-router-dom";
import { web3 } from "../../service/Service";

/*
Guards child-components (GamePage) from being accessed without a valid 
account address, thus returns any invalid accesses back to the JoinPage
 */

export const GameGuard = (props) => {
  if (web3.utils.isAddress(props.address)) {
    // valid address
    return props.children;
  } else if (!props.joined) {
    // joined not set correctly -> e.g. upon reload
    return <Redirect to={"/"} />;
  } else if (props.address === null) {
    // joined set correctly, but address not yet set to state -> no redirect wanted
    return <div />;
  } else {
    return <Redirect to={"/"} />;
  }
};
