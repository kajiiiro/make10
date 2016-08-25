"use strict"

class TotalN {
  constructor(total, numberStr) {
    // 合計いくつになることを求めるか
    this._total          = total;
    // 入力される桁数
    this._numberOfDigits = null;
    // 入力される数値文字列
    this._numberStr      = numberStr;
    this._initialize(numberStr);
  }
  _initialize(numberStr) {
    // 引数はN桁の数値文字列を受け取り、
    // それぞれ分解する
    if ("string" !== typeof numberStr) {
      throw new Error("Invalid type of input: " + typeof numberStr);
    }
    // 入力される桁数の決定 4桁〜2桁まで対応
    for (let i = 4;i >= 2;--i) {
      let tmp = new RegExp("^[0-9]{" + i + "}$");
      if (null !== numberStr.match(tmp)) {
        this._numberOfDigits = i
      }
    }
    if (null === this._numberOfDigits) {
      throw new Error("Invalid number of input: " + numberStr);
    }
    this._numbers = numberStr.split("").map((item) => {return Number(item);});
  }
  index() {
    let first  = this._numbers[0];
    let second = this._numbers[1];
    let third  = this._numbers[2];
    let forth  = this._numbers[3];
    switch (this._numberOfDigits) {
    case 2:
      return this._getIndex(first, second);
    break;
    case 3:
      let p1 = this._getIndex  (first , second);
      let p2 = this._getIndex  (second, third);
      p1     = this._mergeIndex(p1    , third);
      p2     = this._mergeIndex(first , p2);
      return this._extinct(p1.concat(p2));
    break;
    case 4:
      let c1   = this._getIndex(first   , second);
      let c2   = this._getIndex(second  , third);
      let c3   = this._getIndex(third   , forth);
      let c1_1 = this._mergeIndex(c1    , third);
      c1_1     = this._mergeIndex(c1_1  , forth);
      let c1_2 = this._mergeIndex(c1    , c3);
      let c2_1 = this._mergeIndex(first , c2);
      c2_1     = this._mergeIndex(c2_1  , forth);
      let c2_2 = this._mergeIndex(c2    , forth);
      c2_2     = this._mergeIndex(first , c2_2);
      let c3_1 = this._mergeIndex(second, c3);
      c3_1     = this._mergeIndex(first , c3_1);
      return this._extinct(c1_1.concat(c1_2, c2_1, c2_2, c3_1));
    break;
    }
  }
  isTotal() {
    let result = this.index();
    let total  = this._total;
    console.log(this._numberStr + ":" + result.some((item) => {return item === total;}));
  }
  calculate() {
    let first  = this._numbers[0];
    let second = this._numbers[1];
    let third  = this._numbers[2];
    let forth  = this._numbers[3];
    switch (this._numberOfDigits) {
    case 2:
      let p = this._getPattern(first, second);
      this._checkPattern(p);
      this._printResult(p);
    break;
    case 3:
      let p1 = this._getPattern(first, second);
      p1 = this._mergePattern(p1, third);
      this._checkPattern(p1);
      this._printResult(p1);
    break;
    case 4:
    break;
    }
  }
  _extinct(array) {
    // 重複列を削除する
    array = array.filter((item, index, self) => {return self.indexOf(item) === index;});
    // 数的ソートを行う
    array.sort((a, b) => {return a - b;});
    return array;
  }
  _gen(formula, result) {
    return {formula: formula, result: result};
  }
  _getIndex(f, s) {
    // add, subtraction, multiplication, division
    let add = (f, s) => {return Number(f + s);};
    let sub = (f, s) => {return Number(f - s);};
    let mul = (f, s) => {return Number(f * s);};
    let div = (f, s) => {return Number(f / s);};
    // first inversion, second inversion
    let fi  = f * (-1);
    let si  = s * (-1);
    let result = [
      add(f , s ),//add    
      sub(f , s ),//sub    
      mul(f , s ),//mul    
      div(f , s ),//div    
      add(fi, s ),//add_if 
      sub(fi, s ),//sub_if 
      mul(fi, s ),//mul_if 
      div(fi, s ),//div_if 
      add(f , si),//add_is 
      sub(f , si),//sub_is 
      add(fi, si),//add_ifs
      sub(fi, si),//sub_ifs
    ];
    result = this._extinct(result);
    return result;
  }
  _mergeIndex(index1, index2) {
    let f = null, s = null;
    let index = [];
    if (!Array.isArray(index1)) f = index1;
    if (!Array.isArray(index2)) s = index2;
    if (f !== null && s !== null) {
      return this._getIndex(f, s);
    } else if (f !== null) {
      index2.forEach((item) => {
        index = index.concat(this._getIndex(f, item));
      });
    } else if (s !== null) {
      index1.forEach((item) => {
        index = index.concat(this._getIndex(item, s));
      });
    } else {
      index1.forEach((item1) => {
        index2.forEach((item2) => {
          index = index.concat(this._getIndex(item1, item2));
        });
      });
    }
    index = this._extinct(index);
    return index;
  }
  _getPattern(f, s, fs, ss) {
    // add, subtraction, multiplication, division
    let add = (f, s) => {return Number(f + s);};
    let sub = (f, s) => {return Number(f - s);};
    let mul = (f, s) => {return Number(f * s);};
    let div = (f, s) => {return Number(f / s);};
    // first inversion, second inversion
    let fi  = f * (-1);
    let si  = s * (-1);
    // first inversion string, second inversion string
    let fis = fs ? "(-(" + fs + "))" : "(" + fi + ")";
    let sis = ss ? "(-(" + ss + "))" : "(" + si + ")";
    // first string, second string
    fs = fs ? "(" + fs + ")" : f;
    ss = ss ? "(" + ss + ")" : s;
    return [
      this._gen(fs  + "+" + ss , add(f , s )),//add    
      this._gen(fs  + "-" + ss , sub(f , s )),//sub    
      this._gen(fs  + "*" + ss , mul(f , s )),//mul    
      this._gen(fs  + "/" + ss , div(f , s )),//div    
      this._gen(fis + "+" + ss , add(fi, s )),//add_if 
      this._gen(fis + "-" + ss , sub(fi, s )),//sub_if 
      this._gen(fis + "*" + ss , mul(fi, s )),//mul_if 
      this._gen(fis + "/" + ss , div(fi, s )),//div_if 
      this._gen(fs  + "+" + sis, add(f , si)),//add_is 
      this._gen(fs  + "-" + sis, sub(f , si)),//sub_is 
      this._gen(fs  + "*" + sis, mul(f , si)),//mul_is 
      this._gen(fs  + "/" + sis, div(f , si)),//div_is 
      this._gen(fis + "+" + sis, add(fi, si)),//add_ifs
      this._gen(fis + "-" + sis, sub(fi, si)),//sub_ifs
      this._gen(fis + "*" + sis, mul(fi, si)),//mul_ifs
      this._gen(fis + "/" + sis, div(fi, si)),//div_ifs
    ];
  }
  _checkPattern(pattern) {
    let mark = (target) => {target.isTotal = this._total === target.result;};
    pattern.forEach((item) => {
      mark(item);
    });
  }
  _printResult(pattern) {
    let str = [];
    pattern.forEach((item) => {
      if (item.isTotal) str.push(item.formula);
    });
    if (0 < str.length) {
      console.log(this._numberStr + ":" + str.join(","));
    } else {
      console.log(this._numberStr + ":-");
    }
  }
  _mergePattern(pattern1, pattern2) {
    let f = null, s = null;
    let pattern = [];
    if (!Array.isArray(pattern1)) f = pattern1;
    if (!Array.isArray(pattern2)) s = pattern2;
    if (f !== null && s !== null) return this._getPattern(f, s);
    if (f !== null) {
      pattern2.forEach((item) => {
        pattern = pattern.concat(this._getPattern(f, item.result, null, item.formula));
      });
    }
    if (s !== null) {
      pattern1.forEach((item) => {
        pattern = pattern.concat(this._getPattern(item.result, s, item.formula, null));
      });
    }
    return pattern;
  }
};

class Total10 extends TotalN {
  constructor(numberStr) {
    super(Number(10), numberStr);
  }
};

let total10 = new Total10(process.argv[2]);
//total10.calculate();
total10.isTotal();
