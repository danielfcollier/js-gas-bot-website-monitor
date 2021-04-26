// *****************************************************************************
// Configuration
// *****************************************************************************
const adminSheetName = "Configuration";
const domainSheetName = "Domain Monitoring";

// *****************************************************************************
// Main Function
// *****************************************************************************
function monitorDomains() {

  try {
    let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let adminSheet = spreadsheet.getSheetByName(adminSheetName);
    let domainsSheet = spreadsheet.getSheetByName(domainSheetName);

    let admin = getAdmin(adminSheet);
    let domainsArray = getDomains(domainsSheet);

    let domainsStatusArray = domainsArray.map(verifyDomainStatus);
    let domainsErrorsArray = domainsStatusArray.filter(filterDomainsWithError);

    if (domainsErrorsArray.length > 0) {
      sendEmailToAdmin(domainsErrorsArray, admin);
    }

    setDomainsStatusToSheet(domainsStatusArray, domainsSheet);

    return true;
  }
  catch (err) {
    Logger.log('Error: ' + err.toString())
  }
}
// *****************************************************************************
function setDomainsStatusToSheet(domainsStatusArray, domainsSheet) {
  let domainsStatus = domainsStatusArray.map(statusData => [statusData.status]);
  domainsSheet.getRange("B2:B" + domainsSheet.getLastRow()).setValues(domainsStatus);
}
// *****************************************************************************
function getAdmin(adminSheet) {
  let adminData = adminSheet.getRange("C4:C8").getValues();

  class Admin {
    constructor({ name, email, timerHour }) {
      this.name = name;
      this.email = email;
      this.timerHour = timerHour;
    }
    firstName() { return this.name.split(" ")[0]; };
  };

  let admin = new Admin({
    name: adminData[0][0],
    email: adminData[2][0],
    timerHour: adminData[4][0]
  });

  return admin;
}
// *****************************************************************************
function getDomains(domainsSheet) {
  return domainsSheet.getRange("A2:A" + domainsSheet.getLastRow()).getValues();
}
// *****************************************************************************
function verifyDomainStatus(domain) {
  let status = "error";
  try {
    status = UrlFetchApp.fetch(domain[0].trim()).getResponseCode() == 200 ? "ok" : response;
  }
  catch (err) {
    Logger.log("Error: " + err.toString());
  }
  return { domain: domain[0], status: status };
}
// *****************************************************************************
function filterDomainsWithError(domainStatusData) {
  if (domainStatusData.status === "error") {
    return domainStatusData;
  }
}
// *****************************************************************************
function sendEmailToAdmin(domainsErrorsArray, admin) {
  try {
    let messageWithErrors = domainsErrorsArray.reduce(buildEmailBody, "");
    let htmlBody = 'Hi ' + admin.firstName() + `,<br><br>
  Please, verify the following domain(s) with error(s):<br>`+ messageWithErrors;
    MailApp.sendEmail(admin.email, "Domain(s) with Error(s)", '', { htmlBody: htmlBody });
  }
  catch (err) {
    Logger.log("Error: " + err.toString());
    return false;
  }
}
// *****************************************************************************
function buildEmailBody(messageWithErrors, domainStatusData) {
  return messageWithErrors + " - " + domainStatusData.domain + "<br>";
}
// *****************************************************************************