
let currentTabURL = "";
let TableNodeTop = 
    `
    <div class="row ">
        <button data-siteurl="
    `
    
let TableNodeLink = 
    `
       " id="site-button" type="button" class="col-10 border-bottom lead text-white btn btn-outline-info">
    `


let TableNodeBottom = 
    `
        </button>
        <button type="button" class="col-1 btn btn-secondary">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
            </svg>
        </button>
        
        <button type="button" class="col-1 btn btn-secondary justify">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
            </svg>
        </button>
    </div>
    `


let TableList = [
        {"title": "Boogle1", "url": "https://google.com"},
        {"title": "Boogle2", "url": "https://google.com"},
        {"title": "Boogle3", "url": "https://google.com"},
    ]

let emptyTableList = [ ]


/* EVENT LISTENER FOR BUTTON */
document.addEventListener('click',function(e){
    if(e.target && e.target.id== 'site-button'){
          //console.log('CLICKED', e.target.dataset.siteurl);
          chrome.tabs.create({ url: e.target.dataset.siteurl });
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
function activaTab(tab){
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};

function createTab(){
    console.log('IM NEW TAB')
}

// Get saved SiteList 
function getSites() {

    let list;

    chrome.storage.sync.get('sitelist', function(result) {

        //console.log('Value currently is -> ' + JSON.stringify(result.sitelist));

        if(result.sitelist === undefined) {
            
            chrome.storage.sync.set({"sitelist": '[]'}, function() {
                console.log('Value is set to ' + emptyTableList);
            });
        }

        console.log('Return 2:', result.sitelist, typeof(result.sitelist));

    });

}

// Generate saved sites Table 
function generateTable() {

    //Create Table
    var frag = document.createDocumentFragment();

    //Get stored sites
    chrome.storage.sync.get('sitelist', function(result) {

        //console.log('Value currently is -> ' + JSON.stringify(result.sitelist));

        if(result.sitelist === undefined) {
            
            chrome.storage.sync.set({"sitelist": '[]'}, function() {
                console.log('Value is set to ' + emptyTableList);
            });
        }

        console.log('Return Table:', result.sitelist, typeof(result.sitelist));

        for (sites of result.sitelist) {

            var node = document.createElement("div");
            let TableNode = TableNodeTop + sites.url + TableNodeLink + sites.title + TableNodeBottom;
            node.innerHTML  = TableNode; 
            frag.appendChild(node);  
        }     
        document.getElementById("saved-table").appendChild(frag);

    });


    // console.log("BEGIN TABLE: ", site_list)
    // let TableNode = TableNodeTop + 'TEST' + TableNodeBottom;
    // node.innerHTML  = TableNode; 
    // frag.appendChild(node); 

    // for (sites of sitelist) {

    //     console.log('Test', sites.name)
        

    //     let TableNode = TableNodeTop + 'TEST' + TableNodeBottom;
    //     node.innerHTML  = TableNode; 
    //     frag.appendChild(node);  
    // }                 
    
    
}

function onSubmit() {
    
    let sitelist = getSites();
    //let obj = JSON.parse(sitelist);

    console.log('OBJECT',sitelist);

    // obj['sitelist'].push({"title": "Boogle4", "url": "https://google.com"});

    // chrome.storage.sync.set({'sitelist': value}, function() {
    //     console.log('Value is set to ' + value);
    // });

    
    

    // var personJSONString = JSON.stringify(person); 

    // chrome.storage.sync.set({key: value}, function() {
    //     console.log('Value is set to ' + value);
    // });
}
