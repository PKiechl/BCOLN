import React from "react";
import InputBar from "./InputBar";
import Web3 from "web3";
import data from "../truffle/build/contracts/roulette.json";
import { BrowserRouter, Route } from "react-router-dom";
import JoinPage from "./JoinPage";
import Bets from "./Bets";
import RouletteWheel from "./RouletteWheel";
import Header from "./Header";
import Balance from "./Balance";
import SubmittedBets from "./SubmittedBets";

//RPC server from GANACHE,
const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
web3.eth.defaultAccount = web3.eth.accounts[0];

let abi = data.abi;
let contract_address = data.networks[5777].address;

const TestContract = new web3.eth.Contract(abi, contract_address);

class App extends React.Component {
  //using https://semantic-ui.com/ for easy css

  state = {
    winningNumber: null,
    address: null,
    eths: 0,
    bet: false,
    ready: false,
    amount: null,
    bets: [],
  };

  callContractGet = async (event) => {
    event.preventDefault();
    const res = await TestContract.methods.getResult().call();
    this.setState({ winningNumber: res });
    //TODO idea: route to /anim or something to play the roulette animation?
  };

  setAmount = async (amount) => {
    await this.setState({ amount: amount });
    console.log(this.state.amount);
  };

  callSetReady = async (event) => {
    event.preventDefault();
    const account = this.state.address;
    const res = await TestContract.methods.setReady();
    await res.estimateGas();
    const result = await res.send({
      from: account,
      gasPrice: 2000,
      gasLimit: "500000",
    });
    console.log("called ready", result);
    this.setState({ ready: true });
    this.setState({ bet: false });
    this.getAccountBalance();
  };

  callBet = async (betType, nr1, nr2, nr3, nr4) => {
    const account = this.state.address;
    console.log("betType", betType);
    console.log("address", account);

    let res;
    switch (betType) {
      // TODO: the numbers bets currently are tied to betRed. change once implemented
      case "red":
        res = await TestContract.methods.betRed();
        break;
      case "black":
        res = await TestContract.methods.betBlack();
        break;
      case "1num":
        res = await TestContract.methods.betNumber(nr1);
        break;
      case "2combo":
        res = await TestContract.methods.betSplit(nr1, nr2);
        break;
      case "4combo":
        res = await TestContract.methods.betComboFour(nr1, nr2, nr3, nr4);
        break;
    }
    console.log("betType:", betType, "numbers(optional):", nr1, nr2, nr3, nr4);

    await res.send({
      from: account,
      gasPrice: 2000,
      gasLimit: "500000",
      value: web3.utils.toWei(this.state.amount.toString(), "ether"),
    });
    console.log("bet called with: ", this.state.amount);
    this.setState({ bet: true });

    this.setState((prevState) => ({
      bets: [
        ...prevState.bets,
        {
          betType: betType,
          amount: this.state.amount,
          numbers: [nr1, nr2, nr3, nr4],
        },
      ],
    }));
  };

  callJoin = async (event) => {
    // note: leave/join paid by account zero
    console.log("event: ", event);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const res = await TestContract.methods.join();
    const result = await res.send({
      from: account,
      gasPrice: 2000,
      gasLimit: "500000",
    });
    console.log("joined", result);

    await this.setState({ address: event });
    console.log("address: ", this.state.address);
    this.getAccountBalance();
  };

  callLeave = async () => {
    // note: leave/join paid by account zero, the bank
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const res = await TestContract.methods.leave();
    await res.send({
      from: account,
      gasPrice: 2000,
      gasLimit: "500000",
    });
    // TODO: this might have to move somewhere other
    this.setState({ ready: false });
    this.setState({ bet: false });
    this.setState({ amount: null });
    this.setState({ bets: [] });

    window.history.back();
    console.log("leave/back");
  };

  componentDidMount = async () => {
    //send funds to Account 0, that acts as the bank
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const balance = await web3.eth.getBalance(account);
    const eths = web3.utils.fromWei(balance.toString(), "ether");
    if (eths > 95) {
      const res = await TestContract.methods.startup();
      await res.send({
        from: account,
        gasPrice: 2000,
        gasLimit: "500000",
        value: web3.utils.toWei("95", "ether"),
      });
    }
  };

  getAccountBalance = async () => {
    if (this.state.address) {
      const balance = await web3.eth.getBalance(this.state.address);
      const eths = await web3.utils.fromWei(balance.toString(), "ether");
      await this.setState({ eths: eths });
      console.log("eths", this.state.eths);
    }
  };

  render() {
    //renders the InputBar, where the bet amount is entered and returned back to this component

    return (
      <div className="ui container">
        <BrowserRouter>
          <div>
            <Header />
            <Route exact path="/">
              <JoinPage onSubmit={this.callJoin} />
            </Route>
            <Route exact path="/game">
              <Balance eths={this.state.eths} address={this.state.address} />
              <InputBar
                onFormSubmit={this.setAmount}
                inputText={
                  "enter amount. todo: change to wei? only eth's are supported right now"
                }
                disabled={this.state.ready}
              />
              <Bets
                onClick={this.callBet}
                disabled={!this.state.amount || this.state.ready}
              />
              <SubmittedBets bets={this.state.bets} />
              <div className="ui message">
                <div className="header">Winning Number</div>
                <p>{this.state.winningNumber}</p>
              </div>
              <button
                className="ui button"
                disabled={!this.state.bet || this.state.ready}
                onClick={this.callSetReady}
              >
                Set Ready
              </button>
              <button
                className="ui button"
                disabled={!this.state.ready}
                onClick={this.callContractGet}
              >
                Get random number
              </button>
              <button
                className="ui button"
                disabled={this.state.bet}
                onClick={this.callLeave}
              >
                back
              </button>
            </Route>
            <Route exact path="/game/anim">
              <RouletteWheel number={this.state.winningNumber} />
            </Route>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
