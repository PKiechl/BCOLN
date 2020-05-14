import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import JoinPage from "./pages/JoinPage";
import Header from "./helpers/Header";
import "./roulette/roulette.css";
import GamePage from "./pages/GamePage";
import { RouletteContract } from "./service/Service";
import { GameGuard } from "./helpers/guard/GameGuard";

class App extends React.Component {
  //using https://semantic-ui.com/ for easy css

  /*
  contains the two pages (GamePage & JoinPage). Also handles the initial join
  of a user and gets the respective information from the JoinPage
   */

  state = {
    address: null,
    eths: 0,
    joined: false,
    ethsAtJoin: 0,
  };
  constructor(props) {
    super(props);
  }

  callJoin = async (event) => {
    // note: leave/join paid by account zero
    if (window.web3.utils.isAddress(event)) {
      await this.setState({ joined: true });
      this.setState({ address: event });

      const accounts = await window.web3.eth.getAccounts();
      const account = accounts[0];
      const res = await RouletteContract.methods.join();
      const result = await res.send({
        from: window.web3.givenProvider.selectedAddress,
        gasPrice: 2000,
        gasLimit: "500000",
      });
      console.log("joined", result);
      console.log("address: ", this.state.address);
      await this.getAccountBalance(true);
    } else {
      alert("invalid address");
    }
  };

  getAccountBalance = async (join = false) => {
    if (this.state.address) {
      const balance = await window.web3.eth.getBalance(this.state.address);
      const eths = await window.web3.utils.fromWei(balance.toString(), "ether");
      await this.setState({ eths: eths });
      if (join) {
        await this.setState({ ethsAtJoin: eths });
        console.log("ethsAtJoin: ", this.state.ethsAtJoin);
      }
      console.log("eths", this.state.eths);
      return eths;
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
              <GameGuard
                address={this.state.address}
                joined={this.state.joined}
              >
                <GamePage
                  address={this.state.address}
                  ethsAtJoin={this.state.ethsAtJoin}
                  eths={this.state.eths}
                  joined={this.state.joined}
                />
              </GameGuard>
            </Route>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
