import React from "react";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";

class SubmittedBets extends React.Component {
  render() {
    const bets = this.props.bets;

    return (
      <div className="ui  segment">
        <h3 className="ui header">Submitted Bets</h3>
        <ul className="ui middle aligned divided list">
          {bets.map((value, index) => {
            let numbers = [];
            for (let num of value.numbers) {
              if (num !== "") {
                numbers.push(num);
              }
            }
            numbers = numbers.join(", ");
            if (numbers !== "") {
              numbers = ` - numbers: ${numbers}`;
            }

            return (
              <div className="item" key={index}>
                <Icon className="angle right"/>
                <div className="content">
                  {" "}
                  {value.amount} eth - {value.betType}
                  {numbers}
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default SubmittedBets;
