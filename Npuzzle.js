"use strict"

class MakerN {
  constructor(total, numberStr) {
    // 合計いくつになることを求めるか
    this._total     = Number(total);
    // 入力される数値文字列
    this._numberStr = numberStr;
    // 引数はN桁の数値文字列を受け取り、
    // それぞれ分解する
    if ("string" !== typeof numberStr) {
      throw new Error("Invalid type of input: " + typeof numberStr);
    }
    // 入力される桁数の決定 4桁に対応
    if (null === numberStr.match(/^[0-9]{4}$/)) {
      throw new Error("Invalid number of input: " + numberStr);
    }
    let numbers = numberStr.split("").map((item) => {return Number(item);});
    let first  = numbers[0];
    let second = numbers[1];
    let third  = numbers[2];
    let forth  = numbers[3];
    // inversion
    let first_i  = numbers[0] * (-1);
    let second_i = numbers[1] * (-1);
    let third_i  = numbers[2] * (-1);
    let forth_i  = numbers[3] * (-1);
    // 数列のパターンセットを用意する
    this._patterns = [
      [first  , second  , third  , forth  ],
      [first_i, second  , third  , forth  ],
      [first  , second_i, third  , forth  ],
      [first  , second  , third_i, forth  ],
      [first  , second  , third  , forth_i],
      [first_i, second_i, third  , forth  ],
      [first_i, second  , third_i, forth  ],
      [first_i, second  , third  , forth_i],
      [first  , second_i, third_i, forth  ],
      [first  , second_i, third  , forth_i],
      [first  , second  , third_i, forth_i],
      [first_i, second_i, third_i, forth  ],
      [first_i, second_i, third  , forth_i],
      [first_i, second  , third_i, forth_i],
      [first  , second_i, third_i, forth_i],
      [first_i, second_i, third_i, forth_i],
    ];
    // 演算子のパターンセットを用意する
    let operator = [
      {operator: "+", callback: (f, s) => {return Number(f + s);}},
      {operator: "-", callback: (f, s) => {return Number(f - s);}},
      {operator: "*", callback: (f, s) => {return Number(f * s);}},
      {operator: "/", callback: (f, s) => {return Number(f / s);}},
    ];
    this._operators = [];
    operator.forEach((item1) => {
      operator.forEach((item2) => {
        operator.forEach((item3) => {
          this._operators.push([item1, item2, item3]);
        });
      });
    });
    // フォーマットのパターンセットを用意する
    this._orders = [
      "(((a?b)!c)@d)", // order 1
      "((a?b)!(c@d))", // order 2
      "((a?(b!c))@d)", // order 3
      "(a?((b!c)@d))", // order 4
      "(a?(b!(c@d)))", // order 5
    ];
  }
  make() {
    let self = this;
    let format = (pattern, operator, order) => {
      let result = order;
      result = result.replace("a", pattern[0] < 0 ? "(" + pattern[0] + ")" : pattern[0]);
      result = result.replace("b", pattern[1] < 0 ? "(" + pattern[1] + ")" : pattern[1]);
      result = result.replace("c", pattern[2] < 0 ? "(" + pattern[2] + ")" : pattern[2]);
      result = result.replace("d", pattern[3] < 0 ? "(" + pattern[3] + ")" : pattern[3]);
      result = result.replace("?", operator[0].operator);
      result = result.replace("!", operator[1].operator);
      result = result.replace("@", operator[2].operator);
      return result;
    };
    let gen = (result, pattern, operator, order) => {
      return {
        result : Number(result),
        formula: format(pattern, operator, order),
      };
    };
    let gen1 = (pattern, operator) => {
      let result = null;
      result = operator[0].callback(pattern[0], pattern[1]);
      result = operator[1].callback(result    , pattern[2]);
      result = operator[2].callback(result    , pattern[3]);
      return gen(result, pattern, operator, self._orders[0]);
    };
    let gen2 = (pattern, operator) => {
      let result = null;
      result = operator[0].callback(pattern[0], pattern[1]);
      let _r = operator[2].callback(pattern[2], pattern[3]);
      result = operator[1].callback(result    , _r);
      return gen(result, pattern, operator, self._orders[1]);
    };
    let gen3 = (pattern, operator) => {
      let result = null;
      result = operator[1].callback(pattern[1], pattern[2]);
      result = operator[0].callback(pattern[0], result);
      result = operator[2].callback(result    , pattern[3]);
      return gen(result, pattern, operator, self._orders[2]);
    };
    let gen4 = (pattern, operator) => {
      let result = null;
      result = operator[1].callback(pattern[1], pattern[2]);
      result = operator[2].callback(result    , pattern[3]);
      result = operator[0].callback(pattern[0], result);
      return gen(result, pattern, operator, self._orders[3]);
    };
    let gen5 = (pattern, operator) => {
      let result = null;
      result = operator[2].callback(pattern[2], pattern[3]);
      result = operator[1].callback(pattern[1], result);
      result = operator[0].callback(pattern[0], result);
      return gen(result, pattern, operator, self._orders[4]);
    };
    let results = [];
    let buf = null;
    self._patterns.forEach((pattern) => {
      self._operators.forEach((operator) => {
        buf = gen1(pattern, operator);
        if (buf.result === self._total) {
          results.push(buf.formula);
        }
        buf = gen2(pattern, operator);
        if (buf.result === self._total) {
          results.push(buf.formula);
        }
        buf = gen3(pattern, operator);
        if (buf.result === self._total) {
          results.push(buf.formula);
        }
        buf = gen4(pattern, operator);
        if (buf.result === self._total) {
          results.push(buf.formula);
        }
        buf = gen5(pattern, operator);
        if (buf.result === self._total) {
          results.push(buf.formula);
        }
      });
    });
    if (results.length !== 0) {
      console.log(self._numberStr, self._total, "result:" + results.join(","));
    }
  }
};

class Maker10 extends MakerN {
  constructor(numberStr) {
    super(10, numberStr);
  }
};

for (let i = 0;i < 10000;++i) {
  (new Maker10(("000" + i).slice(-4))).make();
}

