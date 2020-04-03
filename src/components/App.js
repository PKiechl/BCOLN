import React from "react";
import InputBar from "./InputBar";
import Web3 from "web3";

class App extends React.Component {
  //using https://semantic-ui.com/ for easy css

  setValue = amount => {
    //todo: call smart contract with this amount here
    console.log(amount);
  };

  render() {
    //renders the InputBar, where the bet amount is entered and returned back to this component
    return (
      <div className="ui container">
        <h1 className="ui header">Roulette</h1>
        <InputBar onFormSubmit={this.setValue} />
      </div>
    );
  }
}

export default App;
