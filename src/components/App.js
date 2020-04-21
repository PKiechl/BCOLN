import React from "react";
import InputBar from "./InputBar";
import Web3 from "web3";
import data from "../truffle/build/contracts/roulette.json";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import JoinPage from "./JoinPage";
import Bets from "./Bets";

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
    url: null,
    done: false,
    amount: null
  };

  callContractGet = async event => {
    //todo for debugging purposes
    event.preventDefault();
    const res = await TestContract.methods.getResult().call();
    this.setState({ winningNumber: res });
  };

  setAmount = async amount => {
    const ammo = await this.setState({ amount: amount });
    console.log(this.state.amount);
  };

  callSetReady = async event => {
    event.preventDefault();
    // const accounts = await web3.eth.getAccounts();
    const account = this.state.address;
    const res = await TestContract.methods.setReady();

    const gas = await res.estimateGas();
    const result = await res.send({
      from: account,
      gasPrice: 2000,
      gasLimit: "500000"
    });
    console.log("called ready", result);
  };

  callBet = async betType => {
    const account = this.state.address;
    console.log("betType", betType);
    console.log("address", account);

    let res;
    switch (betType) {
      case "red":
        res = await TestContract.methods.betRed();
        break;
      case "black":
        res = await TestContract.methods.betBlack();
        break;
    }

    const result = await res.send({
      from: account,
      gasPrice: 2000,
      gasLimit: "500000",
      value: web3.utils.toWei(this.state.amount.toString(), "ether")
    });
    console.log("bet called with: ", this.state.amount);
  };

  callJoin = async event => {
    // note: leave/join paid by account zero
    // event.preventDefault();
    console.log("event: ", event);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[5];
    const res = await TestContract.methods.join();
    const result = await res.send({
      from: account,
      gasPrice: 2000,
      gasLimit: "500000"
    });
    console.log("joined", result);
    let url = window.location.href;
    window.location.href = url + "game";
    const w = await this.setState({ address: event });
    console.log("address: ", this.state.address);
  };

  callLeave = async () => {
    // note: leave/join paid by account zero
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const res = await TestContract.methods.leave();
    const result = await res.send({
      from: account,
      gasPrice: 2000,
      gasLimit: "500000"
    });
    window.history.back();
    console.log("leave/back");
  };

  // setAccountAddress = async (accAddress) => {
  //   const address = await this.setState({ address: accAddress });
  //   console.log("address set: ", this.state.address);
  // };

  componentDidMount = async () => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const balance = await web3.eth.getBalance(account);
    const eths = web3.utils.fromWei(balance.toString(), "ether");
    if (eths > 95) {
      const res = await TestContract.methods.startup();
      const result = await res.send({
        from: account,
        gasPrice: 2000,
        gasLimit: "500000",
        value: web3.utils.toWei("95", "ether")
      });
    }
    let data = JSON.parse(localStorage.getItem("address"));
    const d = await this.setState({ address: data.address });
    console.log("address in state", this.state.address);
  };

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem("address", JSON.stringify(nextState));
  }

  render() {
    //renders the InputBar, where the bet amount is entered and returned back to this component
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/">
              <JoinPage onSubmit={this.callJoin} />
            </Route>
            <Route path="/game">
              <div className="ui container">
                <h1 className="ui header">Roulette</h1>

                <InputBar
                  onFormSubmit={this.setAmount}
                  inputText={"enter amount"}
                />
                <Bets onClick={this.callBet} />

                <div className="ui message">
                  <div className="header">Winning Number</div>
                  <p>{this.state.winningNumber}</p>
                </div>
                <button className="ui button" onClick={this.callSetReady}>
                  Set Ready
                </button>
                <button className="ui button" onClick={this.callContractGet}>
                  Get random number
                </button>
                <button className="ui button" onClick={this.callLeave}>
                  back
                </button>
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
