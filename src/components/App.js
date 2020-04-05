import React from "react";
import InputBar from "./InputBar";
import Web3 from "web3";
import data from "../truffle/build/contracts/test1.json";

//RPC server from GANACHE,
const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
web3.eth.defaultAccount = web3.eth.accounts[0];

let abi = data.abi;
let contract_address = data.networks[5777].address;

const TestContract = new web3.eth.Contract(
  abi,
  contract_address
);

class App extends React.Component {
  //using https://semantic-ui.com/ for easy css

  setValue = amount => {
    //todo: call smart contract with this amount here
    console.log(amount);
    this.getData(amount);
  };

  getData = async event => {
    //TODO just for test contract, not sure if we will need a get on the contract?
    //TODO do something with promise
    await TestContract.methods
      .get()
      .call()
      .then(console.log);
  };

  setData = async amount => {
    // const amount = this.state.amount;
    // event.preventDefault();
      console.log(amount);
      console.log()

    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = await TestContract.methods.set(amount).estimateGas();
    const result = await TestContract.methods
      .set(amount)
      .send({ from: account, gas });
    console.log(result);
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
