import React from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

const ModalWon = props => {
  console.log("modal won: ", props.amountWon);

  return (
    <Modal open={props.show} basic size="small">
      <Header icon="archive" content="Archive Old Messages" />
      <Modal.Content>
        <p>{props.amountWon}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={props.back} color="red" inverted>
          <Icon name="chevron circle left" /> Leave
        </Button>
          <Button onClick={props.replay} color="green" inverted>
              <Icon name="redo" /> Replay
          </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalWon;
