"use strict"

let Maker10 = require("./lib/Maker10.js");

let maker = new Maker10();
for (let i = 0;i < 10000;++i) {
  maker.with(("000" + i).slice(-4));
}

