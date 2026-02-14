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

export function checkException(exception, expected, check_only) {
  if (exception.toString().includes(expected)) 
    return true
  if (!check_only)
    throw Error(`Expected '${expected}', got '${exception.toString()}'`)
  return false
}

export function success() {
  console.log("SUCCESSFUL");
}


