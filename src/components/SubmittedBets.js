import React from "react";

class SubmittedBets extends React.Component {

    render() {

        const bets = this.props.bets;

        return (
            <div className="ui padded segment">
                <h3 className="ui header">Submitted Bets</h3>
                <ul className="ui list">
                    {bets.map((value, index) => {
                        return <li key={index}>{value}</li>
                    })}
                </ul>
            </div>
        );
    }
}

export default SubmittedBets;
