/***********************
 * ITW Audition Webhook — Standalone (patched)
 ************************/

// === CONFIG ===
const SHEET_ID  = '169QZzF50FMixF3ShTLyVP1_t8HQdb7-8ZjaxdHA1-aE'; // from your URL
const SHEET_TAB = 'Audition Sign Ups';                             // exact tab name
const SHARED_SECRET =
  PropertiesService.getScriptProperties().getProperty('SHARED_SECRET') || '';

// Health check
function doGet() {
  return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    // 1) Shared-secret gate
    if (SHARED_SECRET) {
      const token = e && e.parameter ? e.parameter.token : undefined;
      if (token !== SHARED_SECRET) return _json({ ok:false, error:'unauthorized' });
    }

    // 2) Parse payload (JSON preferred; form-encoded fallback)
    let data = {};
    if (e && e.postData && e.postData.contents) {
      const t = String(e.postData.type || '').toLowerCase();
      if (t.includes('application/json')) {
        try { data = JSON.parse(e.postData.contents) || {}; } catch (_) { data = {}; }
      }
    }
    if (!Object.keys(data).length && e && e.parameter) {
      data = { ...e.parameter };              // first value per key
      delete data.token;
      if (e.parameters) {                     // collapse multi-valued keys
        for (const k in e.parameters) {
          const v = e.parameters[k];
          if (Array.isArray(v) && v.length > 1) data[k] = v.join(', ');
        }
      }
    }
    if (data && typeof data === 'object' && data.form_data && typeof data.form_data === 'object') {
      data = data.form_data;                  // unwrap Submify-style payload
    }

    // 3) Normalization helper: only write primitives/strings
    function normalizeValue(v) {
      if (v == null) return '';
      if (Array.isArray(v)) return v.join(', ');     // ["Baker","Wolf"] -> "Baker, Wolf"
      if (v instanceof Date) return v;
      if (typeof v === 'object') { try { return JSON.stringify(v); } catch (e) { return String(v); } }
      return String(v);
    }

    // 4) Open sheet (BEFORE using it)
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sh = ss.getSheetByName(SHEET_TAB) || ss.insertSheet(SHEET_TAB);

    // 5) Ensure headers
    const incoming = Object.keys(data);
    let headers = sh.getLastRow()
      ? sh.getRange(1,1,1,Math.max(1,sh.getLastColumn())).getValues()[0]
      : [];
    if (!headers.length) {
      headers = incoming.concat(['_receivedAt']);
      if (!headers.length) headers = ['_receivedAt'];
      sh.getRange(1,1,1,headers.length).setValues([headers]);
    } else {
      let changed = false;
      for (const k of incoming) if (!headers.includes(k)) { headers.push(k); changed = true; }
      if (!headers.includes('_receivedAt')) { headers.push('_receivedAt'); changed = true; }
      if (changed) sh.getRange(1,1,1,headers.length).setValues([headers]);
    }

    // 6) Build and append row ONCE
    const finalHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];

    // Optional debug log to confirm shape
    if (data && data.selected_roles !== undefined) {
      Logger.log('selected_roles (raw): %s', JSON.stringify(data.selected_roles));
    }

    const row = finalHeaders.map(h => (h === '_receivedAt' ? new Date() : normalizeValue(data[h])));
    sh.appendRow(row);

    return _json({ ok:true });
  } catch (err) {
    Logger.log('ERROR: ' + err);
    return _json({ ok:false, error:String(err) });
  }
}


function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
