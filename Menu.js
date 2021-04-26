// *****************************************************************************
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Monitoring Menu')
    .addItem('Monitor your websites', 'monitorDomains')
    .addSeparator()
    .addItem('Set your trigger - run just once', 'createTriggersOnce')
    .addToUi();
}
// *****************************************************************************