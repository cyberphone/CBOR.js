export function assertTrue(text, bool) {
  if (!bool) throw Error("Assertion: " + text);
}

export function assertFalse(text, bool) {
  if (bool) throw Error("Assertion: " + text);
}

 