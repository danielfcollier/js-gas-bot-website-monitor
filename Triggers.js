// *****************************************************************************
function createTriggersOnce() {
  let ui = SpreadsheetApp.getUi();

  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let adminSheet = spreadsheet.getSheetByName(adminSheetName);
  
  let admin = getAdmin(adminSheet);
  admin.timerHour = admin.timerHour.match(/\d{1,2}/g)[0];
  
  ScriptApp.newTrigger("monitorDomains")
    .timeBased()
    .atHour(admin.timerHour)
    .everyDays(1) 
    .create();

  ui.alert("Trigger successfully installed!")
}
// *****************************************************************************