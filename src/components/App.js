import React from "react";
import InputBar from "./InputBar";

class App extends React.Component {
  //using https://semantic-ui.com/ for easy css

  setValue = amount => {
    console.log(amount);

  };

  render() {
    return (
      <div className="ui container">
        <h1 className="ui header">Roulette</h1>
        <InputBar onFormSubmit={this.setValue} />
      </div>
    );
  }
}

export default App;
