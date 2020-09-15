console.log('In Background')

//chrome.runtime.onInstalled.addListener(mainButtonClicked)

let message = {
    saved_sites: {
        name: 'name',
        url: 'url'
    }
}

//chrome.tabs.sendMessage(message)

// let TableList = [
//     {"title": "Boogle1", "url": "https://google.com"},
//     {"title": "Boogle2", "url": "https://google.com"},
//     {"title": "Boogle3", "url": "https://google.com"},
// ]

// let emptyTableList = [ ]

// function getSites() {

//     chrome.storage.sync.get('sitelist', function(result) {

//         console.log('Value currently is ...' + result.sitelist[0]);

//         if(result.sitelist === undefined) {
            
//             chrome.storage.sync.set({"sitelist": emptyTableList}, function() {
//                 console.log('Value is set to ' + emptyTableList);
//             });
//         }

//         console.log(result.sitelist);

//         return result;

//     });

// }

// console.log("HERE", getSites())
