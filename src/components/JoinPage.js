import React from "react";
import InputBar from "./InputBar";

class JoinPage extends React.Component {
  state = { address: "" };

  setAccountAddress = async accAddress => {
    const address = await this.setState({ address: accAddress });
    console.log("address set: ", this.state.address);
    this.props.onSubmit(this.state.address);
  };

  render() {
    return (
      <div className="ui container">
        <h1 className="ui header">Roulette</h1>
        <InputBar
          inputText={"enter address to join. Example: 0xa32B..."}
          onFormSubmit={this.setAccountAddress}
        />
      </div>
    );
  }
}

export default JoinPage;
