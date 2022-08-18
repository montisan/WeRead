import Service from './service';




const service = new Service();
(window as any).service = service;


chrome.runtime.onInstalled.addListener( function() {
    console.log( "Extension installed." );
    // chrome.tabs.create({ url: BASEHOST + '/installed.html' }, function (tab) {
    //     console.log(tab.id)
    // });
} );
// chrome.runtime.setUninstallURL('')

chrome.runtime.onMessage.addListener( function( params, sender, sendResponse ) {
} );

chrome.browserAction.onClicked.addListener( function( activeTab ) {
    chrome.tabs.create({ url: 'chrome-extension://' + chrome.runtime.id +'/index.html'}, function (tab) {
        console.log(tab.id)
        service.getToken()
    });
} );

// export default CookieHooker;