import React from "react";
import {showRoulletteWheel, toggleRoulletteWheel, throwBall, takeBall} from './roulette'

const RouletteWheel = props => {
  const items = ['Apple', 'Banana', 'Cherry'];
  const colors = ['#F76156', '#FBD1A2', '#BED558'];

  return (
      <div>
          <div id="controls">
              <div id="rouletteTable">
                  <div id="rouletteWheel"></div>
                  <div id="ballWheel"></div>
                  <div className="clearfix"></div>
                  <div id="chipTable"></div>
              </div>

              <ul>
                  <li><a href="#" onClick={showRoulletteWheel}>Show wheel</a></li>
                  <li><a href="#" onClick={toggleRoulletteWheel}>Start/Stop wheel</a></li>
                  <li><a href="#" onClick={throwBall}>Roll Ball</a></li>
                  <li><a href="#" onClick={takeBall}>Take Ball</a></li>
              </ul>
          </div>
      </div>
  );

};

export default RouletteWheel;
