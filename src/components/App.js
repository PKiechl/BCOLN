import React from "react";
import InputBar from "./InputBar";
import Web3 from "web3";
import data from "../truffle/build/contracts/roulette.json";
// import data from "../truffle/build/contracts/test1.json";

//RPC server from GANACHE,
const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
web3.eth.defaultAccount = web3.eth.accounts[0];

let abi = data.abi;
let contract_address = data.networks[5777].address;

const TestContract = new web3.eth.Contract(abi, contract_address);

class App extends React.Component {
  //using https://semantic-ui.com/ for easy css

  state = {
    amount: null
  };

  callContractGet = async event => {
    event.preventDefault();
    // const accounts = await web3.eth.getAccounts();
    //todo: need to pick correct account, not sure how to do that
    // const account = accounts[0];
    const res = await TestContract.methods.get().call();
    // const gas = await res.estimateGas();
    // const result = await res.send({ from: account, gas });
    // console.log(result);
    console.log(res);
  };

  ///////////////////////////
  //notes:
  //jedesmal bim contract calle muess gas mitglieferd werde,
  // solangs ned nur e get methode isch, dh. state modifiziert wird
  //
  //account für bank, dh de wo die contracts deployd muen für gas zueständig sii
  //ein bestimmte account -> möglicherwiis accounts[0],
  // im idealfall aber im contract selber ghandlet und ned im client->google

  callContractSet = async amount => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    // const res = await TestContract.methods.set(amount);
    const res = await TestContract.methods.getRandomNumber();

    const gas = await res.estimateGas();
    const result = await res.send({ from: account, gasPrice: gas });
    console.log(result);

    //
    //   const rNumber = await TestContract.methods.get().call();
    //   console.log('rnumber',rNumber);
  };

    callSetReady = async event => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        //todo: need to pick correct account, not sure how to do that
        const account = accounts[5];
        const res = await TestContract.methods.setReady();

        const gas = await res.estimateGas();
        const result = await res.send({
            from: account,
            gasPrice: 2000,
            gasLimit: "500000",
        });
        console.log(result);
    };


  callBet = async event => {
    const accounts = await web3.eth.getAccounts();
    //todo: need to pick correct account, not sure how to do that
    const account = accounts[5];
    // const res = await TestContract.methods.set(amount);
    const res = await TestContract.methods.betBlack(99);

    const gas = await res.estimateGas();
    const result = await res.send({
      from: account,
      gasPrice: 2000,
      gasLimit: "500000",
      value: web3.utils.toWei("1", "ether")
    });
    console.log(result);
  };

  callJoin = async event =>{
      event.preventDefault();
      const accounts = await web3.eth.getAccounts();
      //todo: need to pick correct account, not sure how to do that
      const account = accounts[5];
      const res = await TestContract.methods.join();
      const gas = await res.estimateGas();
      const result = await res.send({
          from: account,
          gasPrice: 2000,
          gasLimit: "500000",
      });
      console.log(result);
  };

  render() {
    //renders the InputBar, where the bet amount is entered and returned back to this component
    return (
      <div className="ui container">
        <h1 className="ui header">Roulette</h1>
        <InputBar onFormSubmit={this.callBet} />

        <button className="ui button" onClick={this.callContractGet}>
          Get random number
        </button>
        <button className="ui button" onClick={this.callSetReady}>
          Set Ready
        </button>
        <button className="ui button" onClick={this.callJoin}>
          Join
        </button>
        <div className="ui message">
          <div className="header">Current Amount</div>
          <p>{this.state.amount}</p>
        </div>
      </div>
    );
  }
}

export default App;
