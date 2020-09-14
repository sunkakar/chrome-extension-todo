console.log('In Background')

//chrome.runtime.onInstalled.addListener(mainButtonClicked)

let message = {
    saved_sites: {
        name: 'name',
        url: 'url'
    }
}

chrome.tabs.sendMessage(message)