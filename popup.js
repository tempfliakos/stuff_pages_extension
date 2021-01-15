chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {  
          worker();
      }
    }
  );

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function worker(userId,gameId) {
    for(let i = 0; i < 5; i++) {
        window.scrollTo(0,document.body.scrollHeight/(5-i));
        await sleep(500);
    }
    getTrophies(userId,gameId);
    
}

function getTrophies(userId = 2,gameId) {    
    const trophiesList = ($('ul.achilist')[0]).children;
    let secretsList = [];
    if($('ul.achilist.secret')[0]) {
        secretsList = ($('ul.achilist.secret')[0]).children;
    }
    result = '';
    let trophies = [];
    let secrets = [];
    for(let trophy of trophiesList) {
        if(trophy.children) {
            let value = $(trophy).find('img')[1].src.split('trophy_')[1].split('.')[0];
            value = value.charAt(0).toUpperCase() + value.slice(1);
            trophies.push({
                'picture': $(trophy).find('img')[0].src,
                'title': trophy.children[1].children[0].innerText.trim(),
                'description': trophy.children[1].children[1].innerText.trim(),
                'value': value,
            })
        }
    }

    for(let trophy of secretsList) {
        if(trophy.children) {
            let value = $(trophy).find('img')[1].src.split('trophy_')[1].split('.')[0];
            value = value.charAt(0).toUpperCase() + value.slice(1);
            secrets.push({
                'picture': trophy.children[0].children[0].currentSrc,
                'title': trophy.children[1].children[0].innerText.trim(),
                'description': trophy.children[1].children[1].innerText.trim(),
                'value': value,
            })
        }
    }

    for(let trophy of trophies) {
        result += `insert into user_achievement(user_id, game_id, title, description, secret, picture, value, earned) values (${userId}, ${gameId}, '${replace(trophy.title)}', '${replace(trophy.description)}', false, '${trophy.picture}', '${trophy.value}', false);\n`;
    }
    for(let trophy of secrets) {
        result += `insert into user_achievement(user_id, game_id, title, description, secret, picture, value, earned) values (${userId}, ${gameId}, '${replace(trophy.title)}', '${replace(trophy.description)}', true, '${trophy.picture}', '${trophy.value}', false);\n`;
    }
    download(`${document.title}.sql`,result);
}

function replace(text) {
    return text.replaceAll('\'','\'\'');
}

function download(filename, text) {
    var pom = document.createElement("a");
    pom.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    pom.setAttribute("download", filename);
    if (document.createEvent) {
    var event = document.createEvent("MouseEvents");
    event.initEvent("click", true, true);
    pom.dispatchEvent(event);
    } else {
    pom.click();
    }
}
