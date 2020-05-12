/*
 * Roulette wheel renderer
 * https://github.com/ledlogic/roulette
 * The MIT License (MIT)

Copyright (c) 2014 Jeff Conrad

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * https://github.com/ledlogic/roulette/blob/master/LICENSE
 */

const { Raphael } = require("react-raphael");

const winningNumberDeterminedEvent = new CustomEvent("winningNumberDetermined");

function Rgb(r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
}

var palette = {
  white: new Rgb(255, 255, 255),
  red: new Rgb(200, 0, 0),
  green: new Rgb(0, 150, 0),
  blue: new Rgb(0, 0, 255),
  black: new Rgb(0, 0, 0),

  getRgbForC: function (c) {
    switch (c) {
      case "r":
        return this.red;
        break;
      case "g":
        return this.green;
        break;
      case "b":
        return this.black;
        break;
    }
  },
};

function Segment(c, number, rgb) {
  this.c = c;
  this.number = number;
  this.rgb = rgb;
}

var europeanWheel = [
  "r30",
  "b8",
  "r23",
  "b10",
  "r5",
  "b24",
  "r16",
  "b33",
  "r1",
  "b20",
  "r14",
  "b31",
  "r9",
  "b22",
  "r18",
  "b29",
  "r7",
  "b28",
  "r12",
  "b35",
  "r3",
  "b26",
  "g0",
  "r32",
  "b15",
  "r19",
  "b4",
  "r21",
  "b2",
  "r25",
  "b17",
  "r34",
  "b6",
  "r27",
  "b13",
  "r36",
  "b11",
];

var roulette = {
  aps: 360.0 / 37.0,
  sa: 0, // start angle
  seg: null,
  wheel: null,
  rouletteWheelPaper: null,

  init: function (rouletteWheelPaper) {
    this.rouletteWheelPaper = rouletteWheelPaper;
    this.sa = this.aps / 2.0;

    // pick wheel type
    this.wheel = europeanWheel;

    // create segments
    this.seg = new Array(this.wheel.length);
    for (var i = 0; i < this.wheel.length; i++) {
      var w = this.wheel[i];
      var c = w.substring(0, 1);
      var n = w.substring(1);
      var rgb = palette.getRgbForC(c);
      this.seg[i] = new Segment(c, n, rgb);
    }

    this.renderRouletteWheel();
  },
  renderRouletteWheel: function () {
    // roulette wheel
    var paper = this.rouletteWheelPaper;
    paper.clear();

    // outer path
    var d0 = 400;

    var m0 = d0 * 0.01;
    var x0 = d0 / 2;
    var y0 = d0 / 2;
    var r0 = d0 / 2 - 2 * m0;
    var outerWheel0 = paper.circle(x0, y0, r0);
    //outerwheel
    outerWheel0.attr("fill", "#000000");
    outerWheel0.attr("stroke", "#666666");
    outerWheel0.attr("stroke-width", "1");

    var d = d0;
    var m = d0 * 0.075;
    var x = d / 2;
    var y = d / 2;
    var r = d / 2 - m;

    // render segments
    for (var segIndex = 0; segIndex < roulette.seg.length; segIndex++) {
      var seg = this.seg[segIndex];

      var a1 = segIndex * roulette.aps + roulette.sa;
      var a2 = (segIndex + 1) * roulette.aps + roulette.sa;

      var flag = a2 - a1 > 180;
      var clr = (a2 - a1) / 360;

      // to radians
      a1 = (a1 * Math.PI) / 180;
      a2 = (a2 * Math.PI) / 180;

      var rgb = seg.rgb;

      var attr = {
        path: [
          ["M", x, y],
          ["l", r * Math.cos(a1), r * Math.sin(a1)],
          ["A", r, r, 0, +flag, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)],
          ["z"],
        ],
        fill: "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")",
        stroke: "#fff",
      };
      paper.path().attr(attr);
    }

    // render wheel numbers
    for (var segIndex = 0; segIndex < roulette.seg.length; segIndex++) {
      var seg = this.seg[segIndex];

      var a1 = segIndex * roulette.aps + roulette.sa;
      var a2 = (segIndex + 1) * roulette.aps + roulette.sa;

      var flag = a2 - a1 > 180;
      var clr = (a2 - a1) / 360;

      // to radians
      a1 = (a1 * Math.PI) / 180;
      a2 = (a2 * Math.PI) / 180;

      // text goes at midpoint
      var number = seg.number;
      var a3 = (a1 + a2) / 2;

      var tr = r - 10;
      var tx = x + tr * Math.cos(a3);
      var ty = y + tr * Math.sin(a3);
      var trot = (a3 * 180) / Math.PI - 90;

      paper.text(tx, ty, number).attr({
        font:
          '100 12.5px "Helvetica Neue", Helvetica, "Arial Unicode MS", Arial, sans-serif',
        fill: "#fff",
        rotation: trot,
      });
    }

    var d2 = d0;
    var m2 = d0 * 0.1375;
    var r2 = d2 / 2 - m2;
    var innerWheel2 = paper.circle(x, y, r2);
    innerWheel2.attr("stroke", "#ffffff");
    innerWheel2.attr("stroke-width", "1");

    var d4 = d0;
    var m4 = d0 * 0.2;
    var r4 = d4 / 2 - m4;
    var pocketWheel4 = paper.circle(x, y, r4);
    pocketWheel4.attr("fill", "#000000");
    pocketWheel4.attr("stroke", "#ffffff");
    pocketWheel4.attr("stroke-width", "1");

    var wra = 45;
    var wr = d0 * 0.1;
    for (var i = 0; i < 4; i++) {
      var aw = (i / 4) * 360 + wra + roulette.sa;
      aw = (aw * Math.PI) / 180;
      var attr = {
        path: [
          ["M", x, y],
          ["l", wr * Math.cos(aw), wr * Math.sin(aw)],
        ],
        stroke: "#ffffff",
        "stroke-width": "2",
      };
      paper.path().attr(attr);
    }

    var d5 = d0;
    var m5 = d0 * 0.45;
    var r5 = d5 / 2 - m5;
    var pocketWheel5 = paper.circle(x, y, r5);
    pocketWheel5.attr("stroke", "#ffffff");
    pocketWheel5.attr("stroke-width", "1");

    var d7 = d0;
    var m7 = d0 * 0.475;
    var r7 = d7 / 2 - m7;
    var handleWheel2 = paper.circle(x, y, r7);
    handleWheel2.attr("fill", "#000000");
    handleWheel2.attr("stroke", "#ffffff");
    handleWheel2.attr("stroke-width", "2");

    ball.renderRouletteWheelBall();
  },
  /**
   * Determines the center of the segment containing the provided angle.
   */
  roundAngle: function (at) {
    for (var segIndex = 0; segIndex < roulette.seg.length; segIndex++) {
      var a1 = segIndex * roulette.aps + roulette.sa;
      var a2 = (segIndex + 1) * roulette.aps + roulette.sa;
      a1 = this.limitAngle(a1);
      a2 = this.limitAngle(a2);
      at = this.limitAngle(at);
      if (a1 - 180.0 > 0 && a2 - 180.0 < 0) {
        a1 += 360.0;
        a2 += 360.0;
        at += 360.0;
      }
      if (at >= a1 && at <= a2) {
        return (a1 + a2) / 2.0;
      }
    }
    return at;
  },
  limitAngle: function (a) {
    var ret = a;
    while (ret > 360.0) {
      ret -= 360.0;
    }
    return ret;
  },
};

var ball = {
  rouletteWheelPaper: null,
  sa: 0,
  r: 0,
  stopped: true,
  roulette: null,
  render: false,

  init: function (rouletteWheelPaper, roulette) {
    this.rouletteWheelPaper = rouletteWheelPaper;
    this.roulette = roulette;
    this.reset();
  },
  reset: function () {
    this.sa = 0.1 * 360.0;
    this.r = 2.0;
    this.stopped = false;
    this.render = false;
  },
  getR: function (jumping) {
    var r = Math.max(Math.min(this.r, 1.0), 0.0);
    return r;
  },
  /**
   * Random jumping of ball as it hits the barriers close to the middle.
   */
  jumpBall: function () {
    var r = this.getR();
    if (r == 0.0) {
      this.stop();
    } else if (r > 0.0 && r <= 0.28) {
      var randomNum1 = Math.random();
      randomNum1 = 0.1;
      var deltaR = randomNum1 * 0.1 - 0.05;
      this.r += deltaR;
      r += deltaR;

      var randomNum2 = Math.random();
      randomNum2 = 0.1;
      var deltaA = randomNum2 * 20 - 10;
      this.sa += deltaA;
    }
  },
  renderRouletteWheelBall: function () {
    if (!this.render) {
      return;
    }

    // roulette wheel
    var paper = this.rouletteWheelPaper;

    // var d = 300;
    var d = 400;

    var x = d / 2;
    var y = d / 2;

    // margin
    var r1 = 0.08;
    var r2 = 0.36;

    var r = this.getR();
    var m = d * (r * (r1 - r2) + r2);
    var tr = x - m / 2.0;

    // radius of ball
    var trm = d * 0.015;

    var a = (this.sa * Math.PI) / 180;

    var tx = x + tr * Math.cos(a);
    var ty = y + tr * Math.sin(a);

    var ball0 = paper.circle(tx, ty, trm);
    ball0.attr("fill", "#ffffff");
    ball0.attr("stroke", "#666666");
    ball0.attr("stroke-width", "1");
  },

  stop: function () {
    this.stopped = true;
    this.sa = this.roulette.roundAngle(this.sa);
    var w = this.detWinningNumber();
    document.dispatchEvent(winningNumberDeterminedEvent);
    console.log("Winner: w[" + w + "]");
    //
    rouletteSpinner.doSetPause(true);
  },
  detWinningNumber: function () {
    // search segments for ballangle
    for (var segIndex = 0; segIndex < roulette.seg.length; segIndex++) {
      var seg = roulette.seg[segIndex];

      var a1 = segIndex * roulette.aps + roulette.sa;
      var a2 = (segIndex + 1) * roulette.aps + roulette.sa;

      seg.a1 = roulette.limitAngle(a1);
      seg.a2 = roulette.limitAngle(a2);

      //console.log("seg.number[" + seg.number + "], seg.a1[" + seg.a1 + "], seg.a2["
      //           + seg.a2 + "], ball.sa[" + ball.sa + "]");
      if (seg.a1 <= ball.sa && seg.a2 >= ball.sa) {
        return seg.number;
      }
    }
    return -1;
  },
};

var rouletteSpinner = {
  intervalMs: 10,
  intervalAngle: 6,
  ballAngle: 10,
  ballRadius: 0.025, // ratio of ball position to wheel, > 1. represents sufficient velocity
  rouletteWheelPaper: null,
  lastId: null,
  paused: true,

  init: function () {
    var rouletteWheelPaper = Raphael("rouletteWheel", 400, 400);
    this.rouletteWheelPaper = rouletteWheelPaper;

    roulette.init(rouletteWheelPaper);
    ball.init(rouletteWheelPaper, roulette);
    this.next();
  },

  doRollBall: function () {
    ball.render = true;
  },

  doTakeBall: function () {
    ball.reset();
    setTimeout(function () {
      ball.reset();
    }, this.intervalMs);
    this.doSetPause(true);
  },

  next: function () {
    setTimeout(function () {
      rouletteSpinner.spin();
    }, this.intervalMs);
  },

  doSetPause: function (choice) {
    this.paused = choice;
  },

  spin: function () {
    if (!this.paused) {
      this.spinWheel();
      this.spinBall();
    }
    this.render();
    this.next();
  },

  render: function () {
    roulette.renderRouletteWheel();
  },

  spinWheel: function () {
    roulette.sa += this.intervalAngle;
    while (roulette.sa < 0.0) {
      roulette.sa += 360.0;
    }
    while (roulette.sa >= 360.0) {
      roulette.sa -= 360.0;
    }
  },

  spinBall: function () {
    if (ball.render) {
      if (!ball.stopped) {
        ball.sa -= this.ballAngle;
        ball.r -= this.ballRadius;
      } else {
        ball.sa += this.intervalAngle;
      }

      while (ball.sa < 0.0) {
        ball.sa += 360.0;
      }
      while (ball.sa >= 360.0) {
        ball.sa -= 360.0;
      }

      if (!ball.stopped) {
        ball.jumpBall();
      }

      while (ball.sa < 0.0) {
        ball.sa += 360.0;
      }
      while (ball.sa >= 360.0) {
        ball.sa -= 360.0;
      }
    }
  },
};

var numberMapping = {
  0: 0,
  0.027: 32,
  0.054: 15,
  0.081: 19,
  0.108: 4,
  0.135: 21,
  0.162: 2,
  0.189: 25,
  0.216: 17,
  0.243: 34,
  0.27: 6,
  0.297: 27,
  0.324: 13,
  0.351: 36,
  0.378: 11,
  0.405: 30,
  0.432: 8,
  0.459: 23,
  0.486: 10,
  0.513: 5,
  0.54: 24,
  0.567: 16,
  0.594: 33,
  0.621: 1,
  0.648: 20,
  0.675: 14,
  0.702: 31,
  0.729: 9,
  0.756: 22,
  0.783: 18,
  0.81: 29,
  0.837: 7,
  0.864: 28,
  0.891: 12,
  0.918: 35,
  0.945: 3,
  0.972: 26,
};

const backNumberMapping = {};

for (const i in numberMapping) {
  let val = numberMapping[i];
  backNumberMapping[val] = i;
}

function showRouletteWheel() {
  rouletteSpinner.init();
}

function throwBall(winningNumber) {
  console.log("roulettejs", winningNumber);
  const number = backNumberMapping[winningNumber];
  console.log("number", number);
  roulette.sa = 0;
  ball.sa = number * 360.0;
  rouletteSpinner.doRollBall();
  rouletteSpinner.doSetPause(false);
}

function takeBall() {
  rouletteSpinner.doTakeBall();
}

export { showRouletteWheel };
export { throwBall };
export { takeBall };
