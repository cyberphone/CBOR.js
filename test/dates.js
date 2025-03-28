// Testing date methods
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

function oneDateTime(epoch, isoString) {
  assertTrue("date1", CBOR.String(isoString).getDateTime().getTime() == epoch);
  let cbor = CBOR.decode(CBOR.String(isoString).encode());
  assertTrue("date2", cbor.getDateTime().getTime() == epoch);
  assertTrue("date3", CBOR.Tag(0n, CBOR.String(isoString))
      .getDateTime().getTime() == epoch);
  assertTrue("date3", CBOR.Tag(1n, CBOR.Int(epoch / 1000))
      .getEpochTime().getTime() == epoch);
  assertTrue("date31", CBOR.Int(epoch / 1000)
      .getEpochTime().getTime() == epoch);
  assertTrue("date4", CBOR.Tag(1n, CBOR.Float(epoch / 1000))
      .getEpochTime().getTime() == epoch);
  assertTrue("date5", CBOR.Tag(1n, CBOR.Float((epoch + 3.0) / 1000))
      .getEpochTime().getTime() == epoch + 3);
assertTrue("date5", CBOR.Float((epoch - 3.0) / 1000)
    .getEpochTime().getTime() == epoch - 3);
}

function badDate(hexBor, err) {
  try {
    CBOR.decode(CBOR.fromHex(hexBor));
    fail("must not");
  } catch (error) {
    if (!error.toString().includes(err)) {
      throw error;
    }
  }
}

function oneEpoch(hexBor, epoch, err) {
  assertTrue("epoch1", CBOR.decode(CBOR.fromHex(hexBor))
      .getEpochTime().getTime() == epoch * 1000);
  let date = CBOR.decode(CBOR.fromHex(hexBor));
  try {
    date.checkForUnread();
    fail("must not");
  } catch (error) {
    if (!error.toString().includes(err)) {
      throw error;
    }
  }
  date.getEpochTime();
  date.checkForUnread();
}

oneDateTime(1740060548000, "2025-02-20T14:09:08+00:00");
oneDateTime(1740060548000, "2025-02-20T14:09:08Z");
oneDateTime(1740060548000, "2025-02-20T15:09:08+01:00");
oneDateTime(1740060548000, "2025-02-20T15:39:08+01:30");
oneDateTime(1740060548000, "2025-02-20T12:09:08-02:00");
oneDateTime(1740060548000, "2025-02-20T11:39:08-02:30");

badDate("c001", "got: CBOR.Int");
badDate("c06135", "Invalid ISO date string: 5");
badDate("c16135", "got: CBOR.String");

oneEpoch("FB41D9EDCDE113645A", 1740060548.303, "Data of type=CBOR.Float with value=174");
oneEpoch("c1FB41D9EDCDE113645A", 1740060548.303, "Tagged object 1 of type=CBOR.Float");
oneEpoch("00", 0, "Data of type=CBOR.Int");

try {
  // Z or -+local offset needed.
  CBOR.Tag(0n, CBOR.String("2023-06-22T00:01:43"));
  throw Error("Should not");
} catch (error) {
  if (!error.toString().includes("ISO")) {
    throw error;
  }
}

try {
  // 24 hour is incorrect.
  CBOR.Tag(0n, CBOR.String("2023-06-22T24:01:43Z"));
  throw Error("Should not");
} catch (error) {
  if (!error.toString().includes("ISO")) {
    throw error;
  }
}

success();