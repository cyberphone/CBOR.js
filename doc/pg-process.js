'use strict';

function getRadioValue(name) {
  let ele = document.getElementsByName(name);
  for (var i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      return ele[i].value;
    }
  }
}

function getBytesFromCborHex(hexAndOptionalComments) {
  return Uint8Array.fromHex(hexAndOptionalComments.replaceAll(/#.*(\r|\n|$)/g, '')
                                                  .replaceAll(/( |\n|\r)/g, ''));
}

function addArrays(a, b) {
  let result = new Uint8Array(a.length + b.length);
  result.set(a);
  result.set(b, a.length);
  return result;
}

function getBytesFromCborSequence(cborObjects) {
  let cborBytes = new Uint8Array();
  cborObjects.forEach(o => {
    cborBytes = addArrays(cborBytes, o.encode());
  });
  return cborBytes;
}

function htmlSanitize(text) {
  return text.replaceAll('&','&amp;')
             .replaceAll('>', '&gt;')
             .replaceAll('<', '&lt;')
             .replaceAll('\n', '<br>')
             .replaceAll(' ', '&nbsp;');
}

function getFormattedCbor(selected, sequenceBuilder) {
  let cborBytes = sequenceBuilder.encodeAsSequence();
  switch (selected) {
    case 'diag':
      let next = false;
      let diagnosticNotation = '';
      let decoder = CBOR.initDecoder(cborBytes, CBOR.SEQUENCE_MODE);
      let object;
      while (object = decoder.decodeWithOptions()) {
        if (next) {
          diagnosticNotation += ',\n';
        }
        next = true;
        diagnosticNotation += object.toString();
      }
      return htmlSanitize(diagnosticNotation);

    case 'hexa':
      return cborBytes.toHex();

    case 'cstyle':
      let hex = cborBytes.toHex();
      let cstyle = '';
      for (let i = 0; i < hex.length; ) {
        if (i > 0) {
          cstyle += ', ';
        }
        cstyle += '0x' + hex.charAt(i++) + hex.charAt(i++);
      }
      return cstyle;

    default:
      return cborBytes.toBase64({alphabet:'base64url', omitPadding:true});
  }
}

function setSample() {
  document.getElementById('cborin').value = 
   '# CBOR sample, here expressed in Diagnostic Notation\n' +
   '{\n  1: "next\nline",\n  2: [5.960465188081798e-8, ' +
   '0b100_000000001, b64\'oQVkZGF0YQ\', true, 0("' +
   new Date().toISOString().replace(/\.\d{1,3}/g,'') + '")]\n}';
}

function checkForNonFinites(object) {
  if (object instanceof CBOR.Array) {
    object.toArray().forEach(element => checkForNonFinites(element));
  } else if (object instanceof CBOR.Map) {
    object.getKeys().forEach(key => {
      checkForNonFinites(key);
      checkForNonFinites(object.get(key));
    });
  } else if (object instanceof CBOR.Tag) {
    checkForNonFinites(object.get());
  } else if (object instanceof CBOR.NonFinite) {
    throw new Error('"NaN" or "Infinity" were encountered');
  }
}

async function delayedProcess() {
  document.getElementById('cborout').innerHTML = 'Working...';
  setTimeout(function() {
    doProcess();
  }, 200);
}

async function doProcess() {
  let html = '';
  try {
    let sequenceFlag = document.getElementById('seq').checked;
    let deterministicFlag = document.getElementById('det').checked;
    let rejectNonFiniteFlag = document.getElementById('nan').checked;
    let inData = document.getElementById('cborin').value;
    let cborBytes;
    switch (getRadioValue('selin')) {
      case 'diag':
        cborBytes = sequenceFlag ?
           getBytesFromCborSequence(CBOR.fromDiagnosticSeq(inData))
                                 :
          CBOR.fromDiagnostic(inData).encode();
        break;

      case 'cstyle':
        inData = inData.toLowerCase().replaceAll('0x', '').replaceAll(',', ' ');
 
      case 'hexa':
        cborBytes = getBytesFromCborHex(inData);
        break;

      default:
        cborBytes = Uint8Array.fromBase64(inData, {alphabet:'base64url'});
    }
    let sequenceBuilder = CBOR.Array();
    let decoder = CBOR.initDecoder(cborBytes, 
        (sequenceFlag ? CBOR.SEQUENCE_MODE : 0) |
        (deterministicFlag ? 0 : CBOR.LENIENT_NUMBER_DECODING | CBOR.LENIENT_MAP_DECODING));
    let object;
    while (object = decoder.decodeWithOptions()) {
      if (rejectNonFiniteFlag) {
        checkForNonFinites(object);
      }
      sequenceBuilder.add(object);
      if (!sequenceFlag) {
        break;
      }
    }
    html = getFormattedCbor(getRadioValue('selout'), sequenceBuilder);
  } catch (e) {
    // Filter away the Error type. It has no value without the stack trace anyway.
    let errorMessage = e.toString().replace(/.*Error\: \n?/g, '');
    html = '<span style="color:red;font-weight:bold">' + htmlSanitize(errorMessage) + '</span>';
  }
  document.getElementById('cborout').innerHTML = html;
}