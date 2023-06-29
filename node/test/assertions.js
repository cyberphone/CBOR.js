// Support for Node.js testing

export function assertTrue(text, bool) {
  if (!bool) throw Error("Assertion: " + text);
}

export function assertFalse(text, bool) {
  if (bool) throw Error("Assertion: " + text);
}

export function fail(text) {
  throw Error("Fail: " + text);
}

export function success() {
  console.log("SUCCESSFUL");
}
 
