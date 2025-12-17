// Testing instant methods
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

function truncateDateTime(iso, millis, seconds) {
  let dateTime = CBOR.String(iso).getDateTime();
  assertTrue("trdt1", dateTime.getTime() == millis);
  assertTrue("trdt2", CBOR.createDateTime(dateTime, true, false).getDateTime().getTime() == millis);
  assertTrue("trdt3", CBOR.createDateTime(dateTime, false, false).getDateTime().getTime() == seconds * 1000);
}

function truncateEpochTime(float, millis, seconds) {
  let epoch = CBOR.Float(float).getEpochTime();
  assertTrue("tr1", epoch.getTime() == millis);
  assertTrue("tr2", CBOR.createEpochTime(epoch, true).getEpochTime().getTime() == millis);
  assertTrue("tr3", CBOR.createEpochTime(epoch, false).getEpochTime().getTime() == seconds * 1000);
}

function oneGetEpochTime(hexBor, epoch, err) {
  let time = Math.floor((epoch * 1000) + 0.5);
  let instant = CBOR.decode(CBOR.fromHex(hexBor)).getEpochTime();
  assertTrue("epoch1", instant.getTime() == time);
  let cborObject = CBOR.createEpochTime(instant, time % 1000);
  // console.log("E=" + cborObject.toString());
  // console.log("1=" + cborObject.getEpochTime().getTime() + " 2=" + time);
  assertTrue("epoch2", cborObject.getEpochTime().getTime() == time);
  if (time % 1000 > 500) {
    let p1 = Math.floor(epoch + 1.0) * 1000;
    cborObject = CBOR.createEpochTime(instant, false);
    // console.log("r1=" + cborObject.getEpochTime().getTime() + " r2=" + p1);
    assertTrue("epoch3", cborObject.getEpochTime().getTime() == p1);
  }
  instant = CBOR.decode(CBOR.fromHex(hexBor));
  try {
    instant.checkForUnread();
    fail("must not");
  } catch (error) {
    if (!error.toString().includes(err)) {
      throw error;
    }
  }
  instant.getEpochTime();
  instant.checkForUnread();
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
// oneGetEpochTime("c1fb41d9edcde1136c8b", 1740060548.3035, "Tagged object 1 of type=CBOR.Float");
// oneGetEpochTime("c1fb41d9edcde1204189", 1740060548.5045, "Tagged object 1 of type=CBOR.Float");
oneGetEpochTime("c11b0000003afff4417f", 253402300799, "Tagged object 1 of type=CBOR.Int");
oneGetEpochTime("00", 0, "Data of type=CBOR.Int");

function oneMillis(time, iso) {
  let instant = new Date();
  instant.setTime(time);
  assertTrue("cdt1=", CBOR.createDateTime(instant, true, true).getString() == iso);
  let created = CBOR.createDateTime(instant, true, false);
  assertTrue("cdt2=", created.getDateTime().getTime() == time);
  assertTrue("cdt3=", created.getString().length == iso.length + 5);
  created = CBOR.createEpochTime(instant, true);
  assertTrue("cet1=", created.getEpochTime().getTime() == time);
  assertTrue("cet2=", created instanceof CBOR.Float == iso.includes("."));
}

oneMillis(1752189147000, "2025-07-10T23:12:27Z");
oneMillis(1752189147123, "2025-07-10T23:12:27.123Z");
oneMillis(1752189147120, "2025-07-10T23:12:27.12Z");
oneMillis(1752189147100, "2025-07-10T23:12:27.1Z");

truncateEpochTime(1740060548.000, 1740060548000, 1740060548);
truncateEpochTime(0.0, 0, 0);
truncateEpochTime(1740060548.0004, 1740060548000, 1740060548);
truncateEpochTime(1740060548.0005, 1740060548001, 1740060548);

truncateDateTime("2025-07-10T23:12:27Z", 1752189147000, 1752189147);
truncateDateTime("2025-07-10T23:12:27.1Z", 1752189147100, 1752189147);
truncateDateTime("2025-07-10T23:12:27.12Z", 1752189147120, 1752189147);
truncateDateTime("2025-07-10T23:12:27.123Z", 1752189147123, 1752189147);
truncateDateTime("2025-07-10T23:12:27.1233Z", 1752189147123, 1752189147);
truncateDateTime("2025-07-10T23:12:27.1235Z", 1752189147123, 1752189147);
truncateDateTime("2025-07-10T23:12:27.523Z", 1752189147523, 1752189148);

truncateDateTime("1925-07-10T23:12:27Z", -1403570853000, -1403570853);
truncateDateTime("1925-07-10T23:12:27.1Z", -1403570852900, -1403570853);
truncateDateTime("1925-07-10T23:12:27.12Z", -1403570852880, -1403570853);
truncateDateTime("1925-07-10T23:12:27.123Z", -1403570852877, -1403570853);
truncateDateTime("1925-07-10T23:12:27.499Z", -1403570852501, -1403570853);
truncateDateTime("1925-07-10T23:12:27.500Z", -1403570852500, -1403570852);
truncateDateTime("1925-07-10T23:12:27.700Z", -1403570852300, -1403570852);

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
  // Beyond nano-seconds
  CBOR.Tag(0n, CBOR.String("2023-06-22T00:01:43.6666666666Z"));
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
    let instant = new Date();
    instant.setTime(epoch * 1000);
    CBOR.createEpochTime(instant, true);
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
  let instant = new Date();
  let time = typeof dateOrTime == 'number' ? Math.round(dateOrTime) : dateOrTime.getTime();
  instant.setTime(time);
  if (bad) {
    try {
      CBOR.createDateTime(instant, millis, utc);
      throw Error("Should not");
    } catch (error) {
      if (!error.toString().includes("Date object out of range")) {
        throw error;
      }
    }
  } else {
    let dateTime = CBOR.createDateTime(instant, millis, utc);
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