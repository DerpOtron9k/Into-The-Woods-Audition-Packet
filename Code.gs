/************** CONFIG  **************/
const SHEET_ID  = '169QZzF50FMixF3ShTLyVP1_t8HQdb7-8ZjaxdHA1-aE';
const SHEET_TAB = 'Audition Sign Ups';
const DEBUG_TAB = '_Webhook_Debug';

// Drive folder for headshots (DISABLED - using email attachments only)
// const HEADSHOT_FOLDER_ID = '1sP-H_05dI5jTuIuGGzXvVUYo4Z2oxJlP';

// Exact column order (sheet must match)
const HEADERS = [
  '_receivedAt',
  'name',
  'selected_roles',
  'any_role',
  'phone',
  'email',
  'vocal_part',
  'vocal_range',
  'experience',
  'skills',
  'conflicts',
  'headshotUrl' // Sheets HYPERLINK formula
];

// Optional shared secret (Project settings → Script properties → SHARED_SECRET)
const SHARED_SECRET_PROP = 'SHARED_SECRET';

// File size limit (5MB) 
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
/*****************************************/

/** Web-app entry: FORM POST → sheet append → email → HTML redirect */
function doPost(e) {
  try {
    const input = parsePayload_(e);
    authCheck_(input, e);

    // Debug: Basic payload info (production logging)
    debugLog_({ marker: 'payload_received', inputKeys: input ? Object.keys(input) : [] });

    // Timestamp (Central Time)
    input._receivedAt = Utilities.formatDate(new Date(), 'America/Chicago', 'MM/dd/yyyy hh:mm:ss a');

    // === Handle headshot upload (native first, robust fallback second) ===
    let headshotBlob = null;

    // Native Apps Script path
    if (e && e.files && e.files.headshot) {
      headshotBlob = e.files.headshot;
      // debugLog_({ marker: 'native_file_found', name: headshotBlob.getName(), type: headshotBlob.getContentType() });
    }

    // Robust fallback: parse multipart when native path absent
    if (!headshotBlob &&
        e && e.postData && e.postData.type &&
        e.postData.type.indexOf('multipart/form-data') !== -1 &&
        typeof e.postData.contents === 'string' && e.postData.contents.length > 0) {

      // debugLog_({ marker: 'attempting_multipart_parse' });
      const parsed = parseMultipartRobust_(e.postData.type, e.postData.contents, 'headshot');
      if (parsed && parsed.blob) {
        headshotBlob = parsed.blob;
        // debugLog_({ marker: 'multipart_success', name: parsed.filename, type: parsed.contentType });
      }
    }

    // Base64 fallback: when client sent _headshot_b64 fields
    if (!headshotBlob && input._headshot_b64) {
      try {
        const mime = (input._headshot_type || 'image/jpeg').toString();
        const rawName = (input._headshot_name || 'upload-headshot').toString();
        const bytes = Utilities.base64Decode(input._headshot_b64);
        headshotBlob = Utilities.newBlob(bytes, mime, rawName + guessExtFromMime_(mime));
        // debugLog_({ marker: 'base64_success', name: headshotBlob.getName(), type: headshotBlob.getContentType(), size: bytes.length });
      } catch (e2) {
        debugLog_({ marker: 'base64_decode_fail', error: String(e2) }); // Keep error logging
      }
      // Do not push these large fields into the sheet
      delete input._headshot_b64;
      delete input._headshot_type;
      delete input._headshot_name;
    }

    // Validate headshot if present
    if (headshotBlob) {
      validateHeadshot_(headshotBlob);
    }

    // debugLog_({
    //   marker: 'headshot_final_state',
    //   haveBlob: !!headshotBlob,
    //   mime: headshotBlob ? headshotBlob.getContentType() : '',
    //   name: headshotBlob ? headshotBlob.getName() : '',
    //   size: headshotBlob ? headshotBlob.getBytes().length : 0
    // });

    // Headshots are only used for email attachments (no Drive storage)
    if (headshotBlob) {
      input._headshotUrlRaw = 'Image attached to email';
      input.headshotUrl = 'Image attached to email';
    } else {
      input._headshotUrlRaw = '';
      input.headshotUrl = '';
    }

    // Enforce headers and append row
    const { sheet } = openSheet_();
    const row = HEADERS.map(h => toScalar_(input[h]));
    
    // Debug: Row mapping (keep minimal for production)
    // debugLog_({ 
    //   marker: 'row_mapping_debug',
    //   headers: HEADERS,
    //   rowData: row,
    //   inputSample: {
    //     name: input.name,
    //     email: input.email,
    //     phone: input.phone,
    //     selected_roles: input.selected_roles,
    //     headshotUrl: input.headshotUrl
    //   }
    // });
    
    sheet.appendRow(row);
    // debugLog_({ marker: 'sheet_append_success', lastRow: sheet.getLastRow() });

    // Notify
    sendEmailNotification_(input, headshotBlob);
    // debugLog_({ ts: input._receivedAt, mail: 'notifications_dispatched' });

    // POST-Redirect-GET: Simple success page (no redirect)
    return HtmlService.createHtmlOutput(
      `<!doctype html>
<meta charset="utf-8">
<title>Submission Successful</title>
<style>
  body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
  .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
  h1 { color: #2E4035; margin-bottom: 20px; }
  p { color: #666; margin-bottom: 15px; line-height: 1.6; }
  .success-btn { display: inline-block; background: #2E4035; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
  .success-btn:hover { background: #4A6B5A; }
</style>
<div class="container">
  <h1>✅ Thank You!</h1>
  <p>Your audition form has been submitted successfully.</p>
  <p>We look forward to seeing you at auditions!</p>
  <a href="https://intothewoods.vercel.app/" class="success-btn">← Back to Audition Packet</a>
</div>`
    ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  } catch (err) {
    debugLog_({ marker: 'doPost_error', error: String(err), stack: err.stack });
    
    // POST-Redirect-GET: Simple success page (no redirect)
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Submission failed: ' + err.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/** Optional probe: https://.../exec?ping=1 */
function doGet(e) {
  if (e && e.parameter && e.parameter.ping) {
    const stamp = Utilities.formatDate(new Date(), 'America/Chicago', 'MM/dd/yyyy hh:mm:ss a');
    return ContentService.createTextOutput('OK :: audition-webhook v2.1 :: ' + stamp)
      .setMimeType(ContentService.MimeType.TEXT);
  }
  return htmlInfo_();
}

/* ========== Internals ========== */

function parsePayload_(e) {
  let data = {};
  // JSON body
  if (e && e.postData && e.postData.type &&
      String(e.postData.type).indexOf('application/json') !== -1) {
    try { data = JSON.parse(e.postData.contents) || {}; } catch (_) {}
  }
  // URL-encoded / multipart fields
  if (!Object.keys(data).length && e && e.parameter) {
    data = Object.assign({}, e.parameter);
    if (e.parameters) {
      Object.keys(e.parameters).forEach(k => {
        const v = e.parameters[k];
        if (Array.isArray(v)) data[k] = v.join(', ');
      });
    }
  }
  // Nested provider object { form_data: {...} }
  if (data && typeof data === 'object' && data.form_data && typeof data.form_data === 'object') {
    data = data.form_data;
  }
  return data || {};
}

function authCheck_(data, e) {
  const secret = (PropertiesService.getScriptProperties().getProperty(SHARED_SECRET_PROP) || '').trim();
  if (!secret) {
    // No authentication required - allow all submissions
    return;
  }
  const token = (
    (data && data.token) ||
    (e && e.parameter && e.parameter.token) ||
    ''
  ).trim();
  if (token !== secret) throw new Error('Unauthorized: shared secret mismatch');
  delete data.token;
}

function validateHeadshot_(blob) {
  if (!blob) return;
  
  // Check file size
  const size = blob.getBytes().length;
  if (size > MAX_FILE_SIZE) {
    throw new Error(`Image file too large (${Math.round(size/1024/1024)}MB). Maximum size is 5MB.`);
  }
  
  // Check file type
  const contentType = blob.getContentType();
  if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
    throw new Error(`Invalid file type: ${contentType}. Please use JPG or PNG format.`);
  }
  
  // debugLog_({ 
  //   marker: 'headshot_validation_passed', 
  //   size: size, 
  //   type: contentType,
  //   sizeMB: Math.round(size/1024/1024 * 100) / 100
  // });
}

function sanitizeName_(name) {
  return String(name || 'user').replace(/[^a-z0-9_-]/gi, '_').substring(0, 50);
}

function openSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_TAB);
  if (!sheet) sheet = ss.insertSheet(SHEET_TAB);

  // Ensure exact headers in row 1
  const current = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length))
    .getValues()[0].slice(0, HEADERS.length).map(x => (x || '').toString().trim());
  const same = current.length === HEADERS.length && current.every((h, i) => h === HEADERS[i]);
  
  if (!same) {
    // debugLog_({ 
    //   marker: 'headers_mismatch', 
    //   expected: HEADERS, 
    //   current: current,
    //   fixing: true
    // });
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
  
  return { ss, sheet };
}

function debugLog_(obj) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let dbg = ss.getSheetByName(DEBUG_TAB);
    if (!dbg) {
      dbg = ss.insertSheet(DEBUG_TAB);
      // Add headers to debug sheet
      dbg.getRange(1, 1, 1, 2).setValues([['Timestamp', 'Debug Info']]);
    }
    const ts = Utilities.formatDate(new Date(), 'America/Chicago', 'MM/dd/yyyy hh:mm:ss a');
    dbg.appendRow([ts, JSON.stringify(obj, null, 2)]);
  } catch (debugError) {
    // Fail silently - don't let debug errors break the main function
    console.log('Debug log failed:', debugError);
  }
}

function createErrorHtml_(errorMessage) {
  return `<!doctype html>
<meta charset="utf-8">
<title>Submission Error</title>
<style>
  body { font-family: 'Inter', sans-serif; background: #FBF9F5; color: #40312C; text-align: center; padding: 2rem; }
  .container { max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
  h1 { color: #c53030; font-size: 2rem; margin-bottom: 1rem; }
  .error { background: #fed7d7; border: 1px solid #fc8181; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
  .back-btn { display: inline-block; background: #2E4035; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; margin-top: 1rem; font-weight: bold; }
  .back-btn:hover { background: #405a49; }
</style>
<div class="container">
  <h1>Submission Error</h1>
  <div class="error">
    <strong>Error:</strong> ${errorMessage}
  </div>
  <p>Please try again. If the problem persists, contact the administrators.</p>
  <a href="javascript:history.back()" class="back-btn">← Go Back</a>
</div>`;
}

function htmlInfo_() {
  const html = HtmlService.createHtmlOutput(`
<!doctype html>
<meta charset="utf-8">
<title>Into the Woods - Audition Webhook</title>
<style>
  body { font-family: 'Inter', sans-serif; background: #FBF9F5; color: #40312C; text-align: center; padding: 2rem; }
  .container { max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 12px; }
</style>
<div class="container">
  <h1>🌳 Into the Woods</h1>
  <h2>Audition Form Endpoint</h2>
  <p>This endpoint accepts <strong>POST</strong> requests from the audition form.</p>
  <p>Ping check: append <code>?ping=1</code> to the URL.</p>
</div>
  `);
  html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return html;
}

function toScalar_(v) {
  if (v == null) return '';
  if (Array.isArray(v)) return v.join(', ');
  return String(v);
}

/**
 * Robust multipart/form-data parser for Apps Script when e.files is missing.
 * Handles CRLF/LF, and optional Content-Transfer-Encoding (base64|binary).
 * Returns { blob: Blob|null, filename: string|null, contentType: string|null }
 */
function parseMultipartRobust_(contentTypeHeader, bodyText, wantedFieldName) {
  const bMatch = /boundary=([^;]+)/i.exec(contentTypeHeader || '');
  if (!bMatch) return { blob: null, filename: null, contentType: null };
  const boundary = bMatch[1];

  const boundaryMarker = '--' + boundary;
  const endMarker = boundaryMarker + '--';

  // Keep original raw; also make a normalized copy for header parsing only
  const raw = bodyText;
  const safe = bodyText.replace(/\r\n/g, '\n');

  const sections = safe.split(boundaryMarker);
  for (let i = 0; i < sections.length; i++) {
    let sec = sections[i];
    if (!sec) continue;

    sec = sec.replace(/^\s+|\s+$/g, '');
    if (!sec || sec === '--' || sec === endMarker) continue;

    const headerEndIdx = sec.indexOf('\n\n');
    if (headerEndIdx === -1) continue;
    const headersText = sec.substring(0, headerEndIdx);

    // Try to locate the same header block in the original raw string (CRLF)
    const headersTextCRLF = headersText.replace(/\n/g, '\r\n');
    const pos = raw.indexOf(headersTextCRLF);

    let contentStartPos;
    if (pos >= 0) {
      contentStartPos = pos + headersTextCRLF.length + 4; // \r\n\r\n
    } else {
      // Fallback using normalized offsets (+2 for \n\n)
      const safePos = safe.indexOf(headersText);
      contentStartPos = safePos >= 0 ? safePos + headersText.length + 2 : -1;
    }
    if (contentStartPos < 0) continue;

    const nextBoundaryIdx = raw.indexOf(boundaryMarker, contentStartPos);
    const contentSlice = nextBoundaryIdx >= 0 ? raw.substring(contentStartPos, nextBoundaryIdx)
                                              : raw.substring(contentStartPos);

    // Parse headers
    const headers = {};
    headersText.split(/\n/).forEach(line => {
      const m = /^([^:]+):(.*)$/.exec(line);
      if (m) headers[m[1].trim().toLowerCase()] = m[2].trim();
    });

    const disp = headers['content-disposition'] || '';
    const nameMatch = /name="([^"]+)"/i.exec(disp);
    if (!nameMatch) continue;
    const fieldName = nameMatch[1];
    const fileNameMatch = /filename="([^"]*)"/i.exec(disp);
    const ctype = headers['content-type'] || 'application/octet-stream';
    const transferEnc = (headers['content-transfer-encoding'] || 'binary').toLowerCase();

    if (fileNameMatch && fileNameMatch[1] && fieldName === wantedFieldName) {
      const filename = fileNameMatch[1] || 'upload.bin';
      let blob;

      if (transferEnc === 'base64') {
        const base64Data = contentSlice.replace(/\s+/g, '');
        blob = Utilities.newBlob(Utilities.base64Decode(base64Data), ctype, filename);
      } else {
        blob = Utilities.newBlob(contentSlice, ctype, filename);
      }
      return { blob: blob, filename: filename, contentType: ctype };
    }
  }

  return { blob: null, filename: null, contentType: null };
}

/** Notification + autoresponse with Gmail quota fallback system */
function sendEmailNotification_(data, headshotBlob) {
  const S = v => (v == null ? '' : String(v)).trim();
  const safe = (label, v) => `${label}: ${S(v) || 'N/A'}`;

  const adminTo = S(data._to) || 'staheli.andrew.g@gmail.com';
  const adminCc = S(data._cc);
  const subject = S(data._subject) || 'Into the Woods — New Audition Submission';
  const replyTo = S(data._replyto) || S(data.email);
  const autoBody = S(data._autoresponse);

  // Plain text body
  const lines = [
    'New audition form received',
    safe('Received At', data._receivedAt),
    safe('Name', data.name),
    safe('Email', data.email),
    safe('Phone', data.phone),
    safe('Selected Roles', data.selected_roles),
    safe('Any Role', data.any_role === 'yes' ? 'Yes' : 'No'),
    safe('Vocal Part', data.vocal_part),
    safe('Vocal Range', data.vocal_range),
    '',
    'Experience:',
    S(data.experience) || 'Not provided',
    '',
    'Skills:',
    S(data.skills) || 'Not provided',
    '',
    'Conflicts:',
    S(data.conflicts) || 'Not provided'
  ];
  const adminBody = lines.join('\n');

  // HTML body with inline preview
  let htmlBody = '<h2>New audition form received</h2><ul>';
  htmlBody += `<li><strong>Received At:</strong> ${S(data._receivedAt)}</li>`;
  htmlBody += `<li><strong>Name:</strong> ${S(data.name)}</li>`;
  htmlBody += `<li><strong>Email:</strong> ${S(data.email)}</li>`;
  htmlBody += `<li><strong>Phone:</strong> ${S(data.phone)}</li>`;
  htmlBody += `<li><strong>Selected Roles:</strong> ${S(data.selected_roles)}</li>`;
  htmlBody += `<li><strong>Any Role:</strong> ${data.any_role === 'yes' ? 'Yes' : 'No'}</li>`;
  htmlBody += `<li><strong>Vocal Part:</strong> ${S(data.vocal_part)}</li>`;
  htmlBody += `<li><strong>Vocal Range:</strong> ${S(data.vocal_range)}</li>`;
  htmlBody += '</ul>';
  htmlBody += `<p><strong>Experience:</strong><br>${(S(data.experience) || 'Not provided').replace(/\n/g, '<br>')}</p>`;
  htmlBody += `<p><strong>Skills:</strong><br>${(S(data.skills) || 'Not provided').replace(/\n/g, '<br>')}</p>`;
  htmlBody += `<p><strong>Conflicts:</strong><br>${(S(data.conflicts) || 'Not provided').replace(/\n/g, '<br>')}</p>`;
  
  if (headshotBlob) {
    const cid = 'headshotImage';
    htmlBody += `<p><strong>Headshot Preview:</strong><br><img src="cid:${cid}" style="max-width:300px;height:auto;border:1px solid #ccc"></p>`;
  }

  // Send admin notification with fallback system
  const adminEmailSent = sendEmailWithFallback_({
    to: adminTo,
    cc: adminCc,
    subject: subject,
    replyTo: replyTo,
    name: 'Into the Woods - Auditions Bot',
    body: adminBody,
    htmlBody: htmlBody,
    attachments: headshotBlob ? [headshotBlob] : undefined,
    inlineImages: headshotBlob ? { headshotImage: headshotBlob } : undefined,
    emailType: 'admin_notification'
  });

  // Autoresponse to submitter with fallback
  const submitter = S(data.email);
  if (submitter && autoBody) {
    const autoEmailSent = sendEmailWithFallback_({
      to: submitter,
      subject: 'We received your audition form - Into the Woods',
      name: 'Into the Woods — Casting Team',
      body: autoBody,
      emailType: 'autoresponse'
    });
    
    if (!autoEmailSent) {
      // Store for later retry if autoresponse fails
      storeFailedEmail_({
        to: submitter,
        subject: 'We received your audition form - Into the Woods',
        body: autoBody,
        emailType: 'autoresponse',
        timestamp: new Date().toISOString()
      });
    }
  }
}

/** Manual test to confirm MailApp scope */
function testEmail() {
  try {
    MailApp.sendEmail('staheli.andrew.g@gmail.com', 'Test Email from Audition Script', 'If you received this, the MailApp service is working correctly.');
    Logger.log('Test email sent successfully.');
  } catch (e) {
    Logger.log('Failed to send test email. Error: ' + e.toString());
  }
}

/** Manual functions for email fallback management */

/**
 * Check email system status
 * Run this to see how many emails are pending
 */
function checkEmailStatus() {
  const status = getEmailStatusReport_();
  Logger.log('Email Status Report:');
  Logger.log(JSON.stringify(status, null, 2));
  return status;
}

/**
 * Retry all failed emails
 * Run this when Gmail quota resets (usually daily)
 */
function retryAllFailedEmails() {
  Logger.log('Starting retry of all failed emails...');
  retryFailedEmails_();
  Logger.log('Retry process completed. Check debug log for details.');
}

/**
 * Test the fallback system
 * This will intentionally trigger quota error simulation
 */
function testEmailFallback() {
  try {
    // Try to send a test email
    const testResult = sendEmailWithFallback_({
      to: 'staheli.andrew.g@gmail.com',
      subject: 'Test Email Fallback System',
      body: 'This is a test of the email fallback system.',
      emailType: 'test'
    });
    
    Logger.log('Test email result: ' + (testResult ? 'SUCCESS' : 'FAILED - Check fallback systems'));
    return testResult;
    
  } catch (error) {
    Logger.log('Test email error: ' + error.toString());
    return false;
  }
}



/** Test Drive folder access (DISABLED - using email attachments only) */
// function testDriveAccess() {
//   try {
//     const folder = DriveApp.getFolderById(HEADSHOT_FOLDER_ID);
//     Logger.log('Folder name: ' + folder.getName());
//     Logger.log('Folder access: SUCCESS');
//     
//     // Test creating a simple file
//     const testBlob = Utilities.newBlob('test content', 'text/plain', 'test.txt');
//     const file = folder.createFile(testBlob);
//     Logger.log('Test file created: ' + file.getUrl());
//     
//     // Clean up
//     file.setTrashed(true);
//     Logger.log('Test completed successfully');
//     
//   } catch (error) {
//     Logger.log('Drive access error: ' + error.toString());
//   }
// }

/** Helper to retry failed uploads stored in script properties (DISABLED - using email attachments only) */
// function retryFailedUploads() {
//   const props = PropertiesService.getScriptProperties();
//   const failed = props.getKeys().filter(key => key.startsWith('FAILED_UPLOAD_'));
//   
//   Logger.log(`Found ${failed.length} failed uploads to retry`);
//   
//   failed.forEach(key => {
//     try {
//       const data = JSON.parse(props.getProperty(key));
//       const blob = Utilities.newBlob(
//         Utilities.base64Decode(data.base64), 
//         data.mimeType, 
//         data.filename
//       );
//       
//       const folder = DriveApp.getFolderById(HEADSHOT_FOLDER_ID);
//       const file = folder.createFile(blob);
//       
//       Logger.log(`Successfully uploaded: ${data.filename} -> ${file.getUrl()}`);
//       props.deleteProperty(key);
//       
//     } catch (error) {
//       Logger.log(`Still failing: ${key} - ${error}`);
//     }
//   });
// }

function guessExtFromMime_(mime) {
  try {
    const m = String(mime).toLowerCase();
    if (m.indexOf('png') > -1) return '.png';
    if (m.indexOf('jpeg') > -1) return '.jpg';
    if (m.indexOf('jpg') > -1) return '.jpg';
    if (m.indexOf('gif') > -1) return '.gif';
  } catch (_) {}
  return '.jpg'; // Default to jpg for images
}

/* ========== EMAIL FALLBACK SYSTEM ========== */

/**
 * Send email with comprehensive fallback system for Gmail quota exceeded
 * @param {Object} emailOptions - Email configuration object
 * @returns {boolean} - True if email sent successfully, false otherwise
 */
function sendEmailWithFallback_(emailOptions) {
  const { to, cc, subject, replyTo, name, body, htmlBody, attachments, inlineImages, emailType } = emailOptions;
  
  // Strategy 1: Try Gmail API first
  try {
    const mailOpts = {
      to: to,
      cc: cc || undefined,
      subject: subject,
      replyTo: replyTo || undefined,
      name: name || 'Into the Woods - Auditions Bot',
      body: body,
      htmlBody: htmlBody || undefined
    };
    
    if (attachments) mailOpts.attachments = attachments;
    if (inlineImages) mailOpts.inlineImages = inlineImages;
    
    MailApp.sendEmail(mailOpts);
    // debugLog_({ 
    //   mail: `${emailType}_success`, 
    //   method: 'gmail_api',
    //   to: to, 
    //   subject: subject 
    // });
    return true;
    
  } catch (gmailError) {
    const errorStr = String(gmailError);
    debugLog_({ 
      mail: `${emailType}_gmail_failed`, 
      error: errorStr,
      to: to,
      subject: subject
    });
    
    // Check if it's a quota exceeded error
    if (errorStr.includes('Service invoked too many times') || 
        errorStr.includes('quota') || 
        errorStr.includes('limit')) {
      
      // Strategy 2: Store in Google Sheets as fallback
      const stored = storeEmailInSheets_(emailOptions);
      if (stored) {
        // debugLog_({ 
        //   mail: `${emailType}_fallback_sheets`, 
        //   method: 'google_sheets',
        //   to: to,
        //   subject: subject
        // });
        return true;
      }
      
      // Strategy 3: Store in Properties for manual processing
      storeFailedEmail_(emailOptions);
      // debugLog_({ 
      //   mail: `${emailType}_fallback_properties`, 
      //   method: 'script_properties',
      //   to: to,
      //   subject: subject
      // });
      return false;
    }
    
    // For other errors, just log and return false
    return false;
  }
}



/**
 * Store email data in Google Sheets as fallback when Gmail quota exceeded
 * @param {Object} emailOptions - Email configuration object
 * @returns {boolean} - True if stored successfully
 */
function storeEmailInSheets_(emailOptions) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let emailLogSheet = ss.getSheetByName('Email_Log');
    
    if (!emailLogSheet) {
      emailLogSheet = ss.insertSheet('Email_Log');
      emailLogSheet.getRange(1, 1, 1, 8).setValues([[
        'Timestamp', 'Type', 'To', 'Subject', 'Body', 'Status', 'Retry_Count', 'Last_Attempt'
      ]]);
    }
    
    const timestamp = Utilities.formatDate(new Date(), 'America/Chicago', 'MM/dd/yyyy hh:mm:ss a');
    const rowData = [
      timestamp,
      emailOptions.emailType || 'unknown',
      emailOptions.to || '',
      emailOptions.subject || '',
      emailOptions.body || '',
      'pending',
      0,
      timestamp
    ];
    
    emailLogSheet.appendRow(rowData);
    return true;
    
  } catch (error) {
    debugLog_({ 
      mail: 'sheets_fallback_failed', 
      error: String(error),
      emailType: emailOptions.emailType
    }); // Keep error logging
    return false;
  }
}

/**
 * Store failed email in Script Properties for manual processing
 * @param {Object} emailOptions - Email configuration object
 */
function storeFailedEmail_(emailOptions) {
  try {
    const props = PropertiesService.getScriptProperties();
    const timestamp = new Date().toISOString();
    const key = `FAILED_EMAIL_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    
    const emailData = {
      ...emailOptions,
      timestamp: timestamp,
      retryCount: 0,
      lastAttempt: timestamp
    };
    
    props.setProperty(key, JSON.stringify(emailData));
    
    // Clean up old failed emails (keep only last 50)
    cleanupOldFailedEmails_();
    
  } catch (error) {
    debugLog_({ 
      mail: 'properties_fallback_failed', 
      error: String(error),
      emailType: emailOptions.emailType
    }); // Keep error logging
  }
}

/**
 * Clean up old failed emails from Properties (keep only last 50)
 */
function cleanupOldFailedEmails_() {
  try {
    const props = PropertiesService.getScriptProperties();
    const failedKeys = props.getKeys().filter(key => key.startsWith('FAILED_EMAIL_'));
    
    if (failedKeys.length > 50) {
      // Sort by timestamp and remove oldest
      const sortedKeys = failedKeys.sort();
      const keysToDelete = sortedKeys.slice(0, failedKeys.length - 50);
      
      keysToDelete.forEach(key => props.deleteProperty(key));
      
      // debugLog_({ 
      //   mail: 'cleanup_old_emails', 
      //   deleted: keysToDelete.length,
      //   remaining: failedKeys.length - keysToDelete.length
      // });
    }
  } catch (error) {
    debugLog_({ mail: 'cleanup_failed', error: String(error) });
  }
}

/**
 * Retry failed emails from Properties (manual trigger)
 * Call this function manually when Gmail quota resets
 */
function retryFailedEmails_() {
  try {
    const props = PropertiesService.getScriptProperties();
    const failedKeys = props.getKeys().filter(key => key.startsWith('FAILED_EMAIL_'));
    
    // debugLog_({ 
    //   mail: 'retry_failed_emails_start', 
    //   count: failedKeys.length 
    // });
    
    let successCount = 0;
    let failCount = 0;
    
    failedKeys.forEach(key => {
      try {
        const emailDataStr = props.getProperty(key);
        if (!emailDataStr) return;
        
        const emailData = JSON.parse(emailDataStr);
        
        // Increment retry count
        emailData.retryCount = (emailData.retryCount || 0) + 1;
        emailData.lastAttempt = new Date().toISOString();
        
        // Try to send email
        const success = sendEmailWithFallback_(emailData);
        
        if (success) {
          props.deleteProperty(key);
          successCount++;
          // debugLog_({ 
          //   mail: 'retry_email_success', 
          //   key: key,
          //   to: emailData.to,
          //   retryCount: emailData.retryCount
          // });
        } else {
          // Update retry count in properties
          props.setProperty(key, JSON.stringify(emailData));
          failCount++;
          
          // Delete if too many retries
          if (emailData.retryCount >= 5) {
            props.deleteProperty(key);
            // debugLog_({ 
            //   mail: 'retry_email_abandoned', 
            //   key: key,
            //   to: emailData.to,
            //   retryCount: emailData.retryCount
            // });
          }
        }
        
      } catch (error) {
        failCount++;
        debugLog_({ 
          mail: 'retry_email_error', 
          key: key,
          error: String(error)
        });
      }
    });
    
    // debugLog_({ 
    //   mail: 'retry_failed_emails_complete', 
    //   success: successCount,
    //   failed: failCount,
    //   total: failedKeys.length
    // });
    
  } catch (error) {
    debugLog_({ 
      mail: 'retry_failed_emails_error', 
      error: String(error)
    });
  }
}

/**
 * Get email status report
 * @returns {Object} - Status report of email system
 */
function getEmailStatusReport_() {
  try {
    const props = PropertiesService.getScriptProperties();
    const failedKeys = props.getKeys().filter(key => key.startsWith('FAILED_EMAIL_'));
    
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const emailLogSheet = ss.getSheetByName('Email_Log');
    let pendingInSheets = 0;
    
    if (emailLogSheet) {
      const lastRow = emailLogSheet.getLastRow();
      if (lastRow > 1) {
        const pendingData = emailLogSheet.getRange(2, 6, lastRow - 1, 1).getValues();
        pendingInSheets = pendingData.filter(row => row[0] === 'pending').length;
      }
    }
    
    return {
      failedInProperties: failedKeys.length,
      pendingInSheets: pendingInSheets,
      totalPending: failedKeys.length + pendingInSheets,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    return {
      error: String(error),
      timestamp: new Date().toISOString()
    };
  }
}