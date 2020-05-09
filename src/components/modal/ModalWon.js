import React from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

const ModalWon = props => {
  // console.log("modal won: ", props.amountWon);
  let message = "";
  let message2 = "";

  if (props.amountWon < 0) {
    message = "You Lost";
    message2 = "Maybe next time?";
  } else {
    message = "You Won";
    message2 = "Keep going!";
  }

  return (
    <Modal open={props.show} basic size="small">
      <Header>
        <Icon name="chart line green" />
      </Header>
      <Modal.Content>
        <h2>
          {message} {Math.abs(Math.round(props.amountWon))} eth! {message2}
        </h2>
        <p>Winning number: {props.rng} </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={props.back} color="red" inverted>
          <Icon name="chevron circle left" /> Leave
        </Button>
        <Button onClick={props.replay} color="green" inverted>
          <Icon name="redo" /> Try Again!
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalWon;
