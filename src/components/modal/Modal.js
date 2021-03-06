import React, { Component } from "react";
import { Button, Icon, Modal, Image } from "semantic-ui-react";
import Roulette from "../view/roulette.png";

class ModalTable extends Component {
  /*
  component is a popup window that displays its content (roulette table) to
  the user upon request
   */

  state = { open: false };

  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  render() {
    const { open } = this.state;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "20px",
        }}
      >
        <Modal
          open={open}
          onOpen={this.open}
          onClose={this.close}
          size="tiny"
          trigger={
            <Button primary icon style={{ backgroundColor: "black" }}>
              ROULETTE TABLE <Icon name="right chevron" />
            </Button>
          }
        >
          <Modal.Header>Roulette Table</Modal.Header>
          <Modal.Content>
            <div>
              <Image centered size="large" src={Roulette} />
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button icon="check" content="Close" onClick={this.close} />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default ModalTable;
