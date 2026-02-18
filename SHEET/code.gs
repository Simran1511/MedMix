/* MEDMIX BACKEND: FORMS + VERIFICATION */

// 1. HANDLE FORM SUBMISSIONS (Contact & Training)
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = e.parameter;
    
    // Decide sheet: 'Sheet1' (Contact) or 'Training'
    var sheetName = "Sheet1";
    if (data.source === "training") {
      sheetName = "Training";
    }
    
    var sheet = ss.getSheetByName(sheetName);
    
    // Append Data
    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.phone,
      data.subject,
      data.message
    ]);
    
    // Send Email Alert
    MailApp.sendEmail({
      to: "sas.invention@gmail.com", // Updated to your email
      subject: "New Enquiry (" + sheetName + "): " + data.subject,
      body: "Name: " + data.name + "\nPhone: " + data.phone + "\nMessage: " + data.message
    });
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. HANDLE CERTIFICATE VERIFICATION (New Feature)
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Certificates');
  const data = sheet.getDataRange().getValues();
  
  // Get search terms from website
  const searchReg = e.parameter.regno;
  const searchName = e.parameter.name;

  // Validation
  if (!searchReg || !searchName) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Missing info" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Loop through rows (Start at 1 to skip Header)
  for (let i = 1; i < data.length; i++) {
    const rowReg = String(data[i][0]).trim().toLowerCase();
    const rowName = String(data[i][1]).trim().toLowerCase();
    
    // Check for MATCH (Case Insensitive)
    if (rowReg === searchReg.trim().toLowerCase() && rowName === searchName.trim().toLowerCase()) {
      
      // Found it! Build the response
      const studentData = {
        status: "success",
        regNo: data[i][0],
        name: data[i][1],
        dob: formatDate(data[i][2]),       // Col C
        fatherName: data[i][3],            // Col D
        center: data[i][4],                // Col E
        passedOn: formatDate(data[i][5]),  // Col F
        photoUrl: cleanDriveLink(data[i][6]) // Col G
      };
      
      return ContentService.createTextOutput(JSON.stringify(studentData))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // If loop finishes with no match
  return ContentService.createTextOutput(JSON.stringify({ status: "not_found" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- HELPER FUNCTIONS ---

// Converts Google Drive Share Links to usable Image Links
function cleanDriveLink(link) {
  if (!link) return "";
  const id = link.match(/[-\w]{25,}/);
  return id ? "https://drive.google.com/uc?export=view&id=" + id[0] : link;
}

// Formats dates nicely (DD/MM/YYYY)
function formatDate(date) {
  if (!date) return "";
  try {
    var d = new Date(date);
    return d.toLocaleDateString('en-GB'); 
  } catch (e) { return date; }
}