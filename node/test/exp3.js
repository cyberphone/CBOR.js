const regex = /\-?\d+/g;
function oneTurn(number) {
  if (number.indexOf('.') < 0) {
    let ret = number.match(regex);
    if (ret) {
      number = ret[0] + '.0' + number.substring(ret[0].length);
    }
  }
  console.log(number);
}

oneTurn("NaN");
oneTurn("1");
oneTurn("-0");
oneTurn("0.3");
oneTurn("1e+77");
oneTurn("950");