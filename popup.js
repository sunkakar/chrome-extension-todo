
let currentTabURL = "";

let TableNodeTop = 
    `<div class="row ">
        <button data-siteurl="`
    
let TableNodeLink = 
    `" id="site-button" type="button" class="col-10 border-bottom lead text-white btn btn-outline-info">
    `


let TableNodeButton = 
    `</button>
        
        <button data-siteurl="`

let TableNodeBottom = 
    `" id="site-remove" type="button" class="col-2 btn btn-secondary justify">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
            </svg>
        </button>
    </div>
    `

let TableNodeEmpty = 
    `
        <div class="card text-center border-info custom-nonemessage">
        <div class="card-body text-info">
        <h5 class="card-title">This is M-T :3</h5>
        <p class="card-text">Add more bookmarks in the ADD section!</p>
        </div>
    </div>     
    `

let TableList = [
        {"title": "Boogle1", "url": "https://google.com"},
        {"title": "Boogle2", "url": "https://google.com"},
        {"title": "Boogle3", "url": "https://google.com"}
    ]

let emptyTableList = [ ]


/* EVENT LISTENER FOR LINK BUTTON */
document.addEventListener('click',function(e){
    if(e.target && e.target.id== 'site-button'){
          //console.log('CLICKED', e.target.dataset.siteurl);
          chrome.tabs.create({ url: e.target.dataset.siteurl });
     }
 });

/* EVENT LISTENER FOR DELETE BUTTON */
document.addEventListener('click',function(e){
    if(e.target && e.target.id== 'site-remove'){
        
          let sitelink = e.target.dataset.siteurl; 
          
          chrome.storage.sync.get('sitelist', function(result) 
          {
            let newlist = result;

            if(result.sitelist === '[]')
            {}
            else
            {
                newlist['sitelist'] = newlist['sitelist'].filter( e => e.url !== sitelink )
            }

            console.log('NO ', newlist['sitelist'], newlist['sitelist'].filter( e => e.url !== sitelink ))

            chrome.storage.sync.set({"sitelist": newlist.sitelist}, function() {
                generateTable();
            });

            console.log('UPDATED Table:', result, typeof(result.sitelist));
       
        });          
     }

 });

/* MAIN */
window.onload = (event) => {

    //Generate Table
    generateTable();

    //Form Submit Event
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          else
          {
            event.preventDefault();
            onSubmit()
            generateTable()
            activeTab('nav-home')
          }
          form.classList.add('was-validated');
        }, false);
    });

    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        currentTabURL = tabs[0].url;
        // use `url` here inside the callback because it's asynchronous!
        var text = document.getElementById('input-url');
        text.value += currentTabURL;
    });

}


// Switch Active Tab 
function activeTab(tab){
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};


// Get saved SiteList 
function getSites() {

    chrome.storage.sync.get('sitelist', function(result) {

        //console.log('Value currently is -> ' + JSON.stringify(result.sitelist));

        if(result.sitelist === undefined) {
            chrome.storage.sync.set({"sitelist": '[]'}, function() {
                console.log('Value is set to ' + emptyTableList);
            });
        }

        console.log('GETTING SITES:', result.sitelist, typeof(result.sitelist));

    });

}

// Generate saved sites Table 
function generateTable() {

    let table = document.getElementById("saved-table");

    //Clear Table
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }

    //Create Table
    var frag = document.createDocumentFragment();

    //Get stored sites
    chrome.storage.sync.get('sitelist', function(result) {

        if(result.sitelist === undefined) {
            
            chrome.storage.sync.set({"sitelist": '[]'}, function() {
                console.log('Value is set to ' + emptyTableList);
            });
        }

        console.log('Return Table:', JSON.stringify(result), result.sitelist, typeof(result.sitelist));

        if(JSON.stringify(result.sitelist) === '[]')
        {
            console.log('CHECKINGF')
            var node = document.createElement("div");
            node.innerHTML  = TableNodeEmpty; 
            frag.appendChild(node);  
            table.appendChild(frag);
        }
        else
        {
            for (sites of result.sitelist) {

                var node = document.createElement("div");
                
                let TableNode = TableNodeTop + 
                                sites.url + 
                                TableNodeLink + 
                                sites.title + 
                                TableNodeButton + 
                                sites.url +
                                TableNodeBottom;

                node.innerHTML  = TableNode; 
                frag.appendChild(node);  
            }     
            table.appendChild(frag);
        }

    

    });        
    
    
}

function onSubmit() {

    //Get Submission Values
    let inputTitle  = document.getElementById("input-title").value;
    let inputURL    = document.getElementById("input-url").value;

    console.log('T: ', inputTitle ,'| U: ', inputURL)

    // Get existing sites
    chrome.storage.sync.get('sitelist', function(result) {

        console.log('Before Submit: \n' + JSON.stringify(result), typeof(result));

        if(result.sitelist === undefined) {            
            chrome.storage.sync.set({"sitelist": "[]"}, function() {
                console.log('Value is set to ' + emptyTableList);
            });
        }

        let newlist = result;

        if(result.sitelist === '[]')
        {
            newlist = {"sitelist": [{"title": "Test[]", "url": "https://sunnykakar.com"}]};
        }
        else
        {
            newlist['sitelist'].push({"title": inputTitle, "url": inputURL});
        }

        console.log('NEW STUFF: \n', JSON.stringify(newlist), typeof(newlist));

        chrome.storage.sync.set({"sitelist": newlist.sitelist}, function() {
            generateTable();
        });

    });
}
