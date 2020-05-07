import React from "react";

class SubmittedBets extends React.Component {

    render() {

        const bets = this.props.bets;

        return (
            <div className="ui  segment">
                <h3 className="ui header">Submitted Bets</h3>
                <ul className="ui list">
                    {bets.map((value, index) => {
                        let numbers = [];
                        for (let num of value.numbers) {
                            if (num !== ""){
                                numbers.push(num);
                            }
                        }
                        numbers = numbers.join(", ");
                        if (numbers !== ""){
                            numbers = `, Numbers: ${numbers}`
                        }

                        return <li key={index}>Bet type: {value.betType}, Amount: {value.amount}{numbers}</li>
                    })}
                </ul>
            </div>
        );
    }
}

export default SubmittedBets;
