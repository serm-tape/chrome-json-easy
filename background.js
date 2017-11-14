chrome.webRequest.onHeadersReceived.addListener( 
	(details) => {
		if(details.tabId !== -1){
			const header = details.responseHeaders.filter( h => h.name.toLowerCase()=='content-type' )
			if(header.length == 1 && header[0].value.includes('json') || header[0].value.includes('html')){
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.executeScript(tab.id, {"file": "built/bundle.js"})
				})
			}
		}
	},
	{
		urls: ['<all_urls>'],
		types: ['main_frame']
	},
	['responseHeaders']
)
