// Testing date methods
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

function oneGetDateTime(epoch, isoString) {
  assertTrue("date1", CBOR.String(isoString).getDateTime().getTime() == epoch);
  let cbor = CBOR.decode(CBOR.String(isoString).encode());
  assertTrue("date2", cbor.getDateTime().getTime() == epoch);
  assertTrue("date3", CBOR.Tag(0n, CBOR.String(isoString)).getDateTime().getTime() == epoch);
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

function oneGetEpochTime(hexBor, epoch, err) {
  let time = Math.floor(epoch * 1000);
  let date = CBOR.decode(CBOR.fromHex(hexBor)).getEpochTime();
  assertTrue("epoch1", date.getTime() == time);
  let cborObject = CBOR.createEpochTime(date, time % 1000);
  // console.log("E=" + cborObject.toString());
  // console.log("1=" + cborObject.getEpochTime().getTime() + " 2=" + time);
  assertTrue("epoch2", cborObject.getEpochTime().getTime() == time);
  if (time % 1000 > 500) {
    let p1 = Math.floor(epoch + 1.0) * 1000;
    cborObject = CBOR.createEpochTime(date, false);
    // console.log("r1=" + cborObject.getEpochTime().getTime() + " r2=" + p1);
    assertTrue("epoch3", cborObject.getEpochTime().getTime() == p1);
  }
  date = CBOR.decode(CBOR.fromHex(hexBor));
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

oneGetDateTime(1740060548000, "2025-02-20T14:09:08+00:00");
oneGetDateTime(1740060548000, "2025-02-20T14:09:08Z");
oneGetDateTime(1740060548000, "2025-02-20T15:09:08+01:00");
oneGetDateTime(1740060548000, "2025-02-20T15:39:08+01:30");
oneGetDateTime(1740060548000, "2025-02-20T12:09:08-02:00");
oneGetDateTime(1740060548000, "2025-02-20T11:39:08-02:30");
oneGetDateTime(1740060548123, "2025-02-20T11:39:08.123-02:30");
oneGetDateTime(1740060548930, "2025-02-20T14:09:08.930Z");
// Next: Truncates!
oneGetDateTime(1740060548930, "2025-02-20T14:09:08.9305Z");
oneGetDateTime(-62167219200000, "0000-01-01T00:00:00Z");
oneGetDateTime(253402300799000, "9999-12-31T23:59:59Z");

badDate("c001", "got: CBOR.Int");
badDate("c06135", "Invalid ISO date string: 5");
badDate("c16135", "got: CBOR.String");

oneGetEpochTime("1A67B73784", 1740060548, "Data of type=CBOR.Int");
oneGetEpochTime("FB41D9EDCDE113645A", 1740060548.303, "Data of type=CBOR.Float with value=174");
oneGetEpochTime("c1FB41D9EDCDE113645A", 1740060548.303, "Tagged object 1 of type=CBOR.Float");
// Next: Truncates!
oneGetEpochTime("c1FB41D9EDCDE113645A", 1740060548.3035, "Tagged object 1 of type=CBOR.Float");
oneGetEpochTime("c1fb41d9edcde1203958", 1740060548.5035, "Tagged object 1 of type=CBOR.Float");
oneGetEpochTime("c11b0000003afff4417f", 253402300799, "Tagged object 1 of type=CBOR.Int");
oneGetEpochTime("00", 0, "Data of type=CBOR.Int");

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

[-1, 253402300800].forEach(epoch => { 
  try {
    // Out of range for Date().
    CBOR.Tag(1n, CBOR.Int(epoch));
    throw Error("Should not");
  } catch (error) {
    if (!error.toString().includes("Epoch out of")) {
      throw error;
    }
  }
  try {
    // Out of range for Date().
    let date = new Date();
    date.setTime(epoch * 1000);
    CBOR.createEpochTime(date, true);
    throw Error("Should not");
  } catch (error) {
    if (!error.toString().includes("Epoch out of")) {
      throw error;
    }
  }
});

assertTrue("zero", CBOR.String("0000-01-01T00:00:00Z").getDateTime().getTime() == -62167219200000);

let now = new Date();
/*
console.log("Now=" + now.getTime() + " iso=" + now.toISOString() + 
            " offset=" + now.getTimezoneOffset() + " str=" + now.toString());
*/

function oneCreateDateTime(dateOrTime, utc, millis, bad) {
  let date = new Date();
  let time = typeof dateOrTime == 'number' ? Math.round(dateOrTime) : dateOrTime.getTime();
  date.setTime(time);
  if (bad) {
    try {
      CBOR.createDateTime(date, millis, utc);
      throw Error("Should not");
    } catch (error) {
      if (!error.toString().includes("Date object out of range")) {
        throw error;
      }
    }
  } else {
    let dateTime = CBOR.createDateTime(date, millis, utc);
    if (millis || !(time % 1000)) {
      assertTrue("cdt1" + dateTime, dateTime.getDateTime().getTime() == time);
    } else if (!millis && time % 1000) {
      assertFalse("cdt2" + dateTime, dateTime.getDateTime().getTime() == time);
    }
  }
}

oneCreateDateTime(now, true, false);
oneCreateDateTime(now, true, true);
oneCreateDateTime(now, false, false);
oneCreateDateTime(now, false, true);

oneCreateDateTime(1740060548000, true, false);
oneCreateDateTime(1740060548000, true, true);
oneCreateDateTime(1740060548501, true, false);
oneCreateDateTime(1740060548501, true, true);
oneCreateDateTime(1740060548000.3, true, true);
oneCreateDateTime(1740060548000.5, true, true);
oneCreateDateTime(-62167219200000, true, true);
oneCreateDateTime(-62167219200001, true, true, true);
oneCreateDateTime(253402300799000, true, true);
oneCreateDateTime(253402300799001, true, true, true);

success();