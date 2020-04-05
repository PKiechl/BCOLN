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

  state = {
    amount: null
  };

  callContractGet = async event => {
    const amount = await TestContract.methods.get().call();
    this.setState({amount: amount});
  };

  callContractSet = async amount => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const res = await TestContract.methods.set(amount);
    const gas = await res.estimateGas();
    const result = await res.send({ from: account, gas });
    console.log(result);
  };

  render() {
    //renders the InputBar, where the bet amount is entered and returned back to this component
    return (
      <div className="ui container">
        <h1 className="ui header">Roulette</h1>
        <InputBar onFormSubmit={this.callContractSet} />

        <button className="ui button" onClick={this.callContractGet}>Get Amount</button>

        <div className="ui message">
          <div className="header">
              Current Amount
          </div>
          <p>{this.state.amount}</p>
        </div>
      </div>
    );
  }
}

export default App;
