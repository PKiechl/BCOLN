import React from "react";
import InputBar from "./InputBar";
import Web3 from "web3";
import data from "../truffle/build/contracts/roulette.json";
import oracleData from "../truffle/build/contracts/Oracle.json";
import { BrowserRouter, Route } from "react-router-dom";
import JoinPage from "./JoinPage";
import Bets from "./Bets";
import Header from "./Header";
import Balance from "./Balance";
import SubmittedBets from "./SubmittedBets";
import { showRouletteWheel, throwBall, takeBall } from "./roulette";
import "./roulette.css";
import ModalTable from "./modal/Modal";

//RPC server from GANACHE,
const web3 = new Web3("ws://127.0.0.1:7545");
web3.eth.defaultAccount = web3.eth.accounts[0];

let abi = data.abi;
let contract_address = data.networks[5777].address;
let oracleAbi = oracleData.abi;
let oracle_address = oracleData.networks[5777].address;

const RouletteContract = new web3.eth.Contract(abi, contract_address);
const OracleContract = new web3.eth.Contract(oracleAbi, oracle_address);

class App extends React.Component {
  //using https://semantic-ui.com/ for easy css

  state = {
    winningNumber: null,
    address: null,
    eths: 0,
    // bet: -> bet has been placed
    bet: false,
    // ready: -> player done placing bets
    ready: false,
    amount: "",
    bets: [],
    ballStopped: false,
    wheelLoaded: false,
    isModalShowing: false,
    isWheelShowing: false
  };
  constructor(props) {
    super(props);
    this.watchEvents(OracleContract);
    this.watchEvents(RouletteContract);
    document.addEventListener(
      "winningNumberDetermined",
      function(e) {
        this.setState({ ballStopped: true });
      }.bind(this)
    );
  }

  openModalHandler = () => {
    this.setState({
      isModalShowing: true
    });
  };

  closeModalHandler = () => {
    this.setState({
      isModalShowing: false
    });
  };

  async watchEvents(contract) {
    contract.events.allEvents(
      {
        fromBlock: "latest"
      },
      (error, event) => {
        if (error) {
          console.error("error while waiting for events");
          return;
        }
        console.log("event arrived.", event.event);
        if (event.event === "LogQueryDone") {
          console.log("query returned result: ", event.returnValues.result);
          this.callPlay();
        }
        if (event.event === "RouletteDone") {
          this.setState({ winningNumber: event.returnValues.rng });
          this.getAccountBalance();
          throwBall(event.returnValues.rng);
        }
      }
    );
  }

  callPlay = async event => {
    const account = this.state.address;
    const res = await RouletteContract.methods.playRoulette();
    await res.estimateGas();
    const result = await res.send({
      from: account,
      gasPrice: 2000,
      gasLimit: "500000"
    });
    console.log("called play", result);
  };

  setAmount = async amount => {
    await this.setState({ amount: amount });
    console.log(this.state.amount);
  };

  callSetReady = async event => {
    if (!this.state.wheelLoaded) {
      // showRouletteWheel();
      this.setState({ wheelLoaded: true });
    }

    event.preventDefault();
    const account = this.state.address;
    const res = await RouletteContract.methods.setReady();
    await res.estimateGas();
    const result = await res.send({
      from: account,
      gasPrice: 2000,
      gasLimit: "500000"
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
      case "red":
        res = await RouletteContract.methods.betRed();
        break;
      case "black":
        res = await RouletteContract.methods.betBlack();
        break;
      case "even":
        res = await RouletteContract.methods.betEven();
        break;
      case "odd":
        res = await RouletteContract.methods.betOdd();
        break;
      case "firstDozen":
        res = await RouletteContract.methods.betFirstDozen();
        break;
      case "secondDozen":
        res = await RouletteContract.methods.betSecondDozen();
        break;
      case "thirdDozen":
        res = await RouletteContract.methods.betThirdDozen();
        break;
      case "1to18":
        res = await RouletteContract.methods.bet1to18();
        break;
      case "19to36":
        res = await RouletteContract.methods.bet19to36();
        break;
      case "col1":
        res = await RouletteContract.methods.betCol1();
        break;
      case "col2":
        res = await RouletteContract.methods.betCol2();
        break;
      case "col3":
        res = await RouletteContract.methods.betCol3();
        break;
      case "1num":
        res = await RouletteContract.methods.betNumber(nr1);
        break;
      case "2combo":
        res = await RouletteContract.methods.betSplit(nr1, nr2);
        break;
      case "4combo":
        res = await RouletteContract.methods.betComboFour(nr1, nr2, nr3, nr4);
        break;
    }
    console.log("betType:", betType, "numbers(optional):", nr1, nr2, nr3, nr4);

    await res.send({
      from: account,
      gasPrice: 2000,
      gasLimit: "500000",
      value: web3.utils.toWei(this.state.amount.toString(), "ether")
    });
    console.log("bet called with: ", this.state.amount);
    this.setState({ bet: true });
    let cnt = this.state.betCounter + 1;
    this.setState(prevState => ({
      bets: [
        ...prevState.bets,
        {
          betType: betType,
          amount: this.state.amount,
          numbers: [nr1, nr2, nr3, nr4]
        }
      ]
    }));
    this.getAccountBalance();
  };

  callJoin = async event => {
    // note: leave/join paid by account zero
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const res = await RouletteContract.methods.join();
    const result = await res.send({
      from: account,
      gasPrice: 2000,
      gasLimit: "500000"
    });
    console.log("joined", result);

    await this.setState({ address: event });
    console.log("address: ", this.state.address);
    this.getAccountBalance();
    if (!this.state.isWheelShowing) {
      showRouletteWheel();
      await this.setState({ isWheelShowing: true });
    }
  };

  resetCurrentBetState = () => {
    // resets amount and bet booleans to allow placement of another bet
    this.setState({ amount: "" });
    this.setState({ bet: false });
  };

  replayRoulette = async () => {
    await this.resetRouletteState();
    this.callJoin(this.state.address);
    takeBall();
  };

  callLeave = async () => {
    await this.resetRouletteState();
    window.history.back();
    console.log("leave/back");
  };

  async resetRouletteState() {
    // note: leave/join paid by account zero, the bank
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const res = await RouletteContract.methods.leave();
    await res.send({
      from: account,
      gasPrice: 2000,
      gasLimit: "500000"
    });
    // TODO: this might have to move somewhere other
    this.setState({ ready: false });
    this.setState({ bet: false });
    this.setState({ amount: "" });
    this.setState({ bets: [] });
    this.setState({ winningNumber: "" });
    this.setState({ ballStopped: false });
  }

  getAccountBalance = async () => {
    if (this.state.address) {
      const balance = await web3.eth.getBalance(this.state.address);
      const eths = await web3.utils.fromWei(balance.toString(), "ether");
      await this.setState({ eths: eths });
      console.log("eths", this.state.eths);
    }
  };

  render() {
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
              <div>
                <ModalTable />
              </div>

              <div className="ui container" style={{ border: "1px red" }}>
                <div id="rouletteWheel"></div>
                <div id="ballWheel"></div>
                <div className="clearfix"></div>
              </div>

              <InputBar
                onFormSubmit={this.setAmount}
                inputText={"enter ether amount to bet"}
                disabled={this.state.ready || this.state.bet}
              />

              <Bets
                onClick={this.callBet}
                disabled={
                  this.state.amount === "" || this.state.ready || this.state.bet
                }
              />
              <SubmittedBets bets={this.state.bets} />
              <div className="ui message" hidden={!this.state.ballStopped}>
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
                disabled={!this.state.bet}
                onClick={this.resetCurrentBetState}
              >
                Place another bet
              </button>
              <button
                className="ui button"
                disabled={!this.state.ready}
                onClick={this.replayRoulette}
              >
                Replay roulette
              </button>
              <button
                className="ui button"
                disabled={this.state.bet}
                onClick={this.callLeave}
              >
                back
              </button>
            </Route>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
