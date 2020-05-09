import React from "react";
import InputBar from "../helpers/InputBar";
import { withRouter } from "react-router-dom";

class JoinPage extends React.Component {
  state = { address: "" };

  setAccountAddress = async accAddress => {
    await this.setState({ address: accAddress });
    console.log("address set: ", this.state.address);
    this.props.onSubmit(this.state.address);
    this.props.history.push("/game");
  };



  render() {
    return (
      <div>
        <InputBar
          inputText={"Enter ethereum account address to play Roulette"}
          altText={"0xa32B..."}
          onFormSubmit={this.setAccountAddress}
        />
      </div>
    );
  }
}

export default withRouter(JoinPage);
