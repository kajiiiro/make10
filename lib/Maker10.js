"use strict"

class Maker10 {
  constructor() {
    let self = this;
    // 合計いくつになることを求めるか
    self._total = Number(10);
    // フォーマットのパターンセット
    self._orders = [
      "(((a?b)!c)@d)",
      "((a?b)!(c@d))",
      "((a?(b!c))@d)",
      "(a?((b!c)@d))",
      "(a?(b!(c@d)))",
    ];
    // 演算子のパターンセットを用意する
    let operator = [
      {operator: "+", callback: (f, s) => {return Number(f + s);}},
      {operator: "-", callback: (f, s) => {return Number(f - s);}},
      {operator: "*", callback: (f, s) => {return Number(f * s);}},
      {operator: "/", callback: (f, s) => {return Number(f / s);}},
    ];
    self._operators = [];
    operator.forEach((item1) => {
      operator.forEach((item2) => {
        operator.forEach((item3) => {
          self._operators.push([item1, item2, item3]);
        });
      });
    });
    let format = (pattern, operator, order) => {
      let result = order;
      let parenthesis = (number) => {return number < 0 ? "(" + number + ")" : number};
      result = result.replace("a", parenthesis(pattern[0]));
      result = result.replace("b", parenthesis(pattern[1]));
      result = result.replace("c", parenthesis(pattern[2]));
      result = result.replace("d", parenthesis(pattern[3]));
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
    // パターン毎の計算順序
    self._functions = [
      (pattern, operator) => {
        let result = null;
        result = operator[0].callback(pattern[0], pattern[1]);
        result = operator[1].callback(result    , pattern[2]);
        result = operator[2].callback(result    , pattern[3]);
        return gen(result, pattern, operator, self._orders[0]);
      },
      (pattern, operator) => {
        let result = null;
        result = operator[0].callback(pattern[0], pattern[1]);
        let _r = operator[2].callback(pattern[2], pattern[3]);
        result = operator[1].callback(result    , _r);
        return gen(result, pattern, operator, self._orders[1]);
      },
      (pattern, operator) => {
        let result = null;
        result = operator[1].callback(pattern[1], pattern[2]);
        result = operator[0].callback(pattern[0], result);
        result = operator[2].callback(result    , pattern[3]);
        return gen(result, pattern, operator, self._orders[2]);
      },
      (pattern, operator) => {
        let result = null;
        result = operator[1].callback(pattern[1], pattern[2]);
        result = operator[2].callback(result    , pattern[3]);
        result = operator[0].callback(pattern[0], result);
        return gen(result, pattern, operator, self._orders[3]);
      },
      (pattern, operator) => {
        let result = null;
        result = operator[2].callback(pattern[2], pattern[3]);
        result = operator[1].callback(pattern[1], result);
        result = operator[0].callback(pattern[0], result);
        return gen(result, pattern, operator, self._orders[4]);
      },
    ];
  }
  _validate() {
    let self = this;
    let numberStr = self._numberStr;
    // 引数はN桁の数値文字列を受け取り、
    // それぞれ分解する
    if ("string" !== typeof numberStr) {
      throw new Error("Invalid type of input: " + typeof numberStr);
    }
    // 入力される桁数の決定 4桁に対応
    if (null === numberStr.match(/^[0-9]{4}$/)) {
      throw new Error("Invalid number of input: " + numberStr);
    }
  }
  _initialize() {
    let self = this;
    // 入力される数値文字列
    let numbers = self._numberStr.split("").map((item) => {return Number(item);});
    // with inversion
    let firsts  = [numbers[0], numbers[0] * (-1)];
    let seconds = [numbers[1], numbers[1] * (-1)];
    let thirds  = [numbers[2], numbers[2] * (-1)];
    let forths  = [numbers[3], numbers[3] * (-1)];
    // 数列のパターンセットを用意する
    self._patterns = [];
    firsts.forEach((first) => {
      seconds.forEach((second) => {
        thirds.forEach((third) => {
          forths.forEach((forth) => {
            self._patterns.push([first, second, third, forth]);
          });
        });
      });
    });
  }
  with(numberStr) {
    let self = this;
    // プライベート関数を利用するための準備
    self._numberStr = numberStr;
    self._validate();
    self._initialize();
    let results = [];
    self._patterns.forEach((pattern) => {
      self._operators.forEach((operator) => {
        self._functions.forEach((func) => {
          let buf = func(pattern, operator);
          if (buf.result === self._total) {
            results.push(buf.formula);
          }
        });
      });
    });
    if (results.length !== 0) {
      console.log(self._numberStr, self._total, "result:" + results.join(","));
    }
  }
};

module.exports = Maker10;

