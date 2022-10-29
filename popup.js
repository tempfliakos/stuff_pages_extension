chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            worker();
        }
    }
);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function worker(userId, gameId) {
    for (let i = 0; i < 5; i++) {
        window.scrollTo(0, document.body.scrollHeight / (5 - i));
        await sleep(500);
    }
    getAchievements(userId, gameId);

}

function getAchievements(userId = 2, gameId) {
    let achievementLists = document.getElementsByClassName('achilist');
    let achievements = [];
    let secrets = [];
    let result = [];
    for (let achievementList of achievementLists) {
        if (achievementList.classList.value.includes('secret')) {
            secrets = prepareAchievements(achievementList.children);
        } else {
            achievements = prepareAchievements(achievementList.children);
        }
    }

    for (let trophy of achievements) {
        result += `insert into user_achievement(user_id, game_id, title, description, secret, picture, value, earned) values (${userId}, ${gameId}, '${replace(trophy.title)}', '${replace(trophy.description)}', false, '${trophy.picture}', '${trophy.value}', false);\n`;
    }
    for (let trophy of secrets) {
        result += `insert into user_achievement(user_id, game_id, title, description, secret, picture, value, earned) values (${userId}, ${gameId}, '${replace(trophy.title)}', '${replace(trophy.description)}', true, '${trophy.picture}', '${trophy.value}', false);\n`;
    }
    download(`${document.title}.sql`, result);
}

function prepareAchievements(achievementList) {
    let result = [];
    if (achievementList) {
        for (let achievement of achievementList) {
            if (achievement.children) {
                result.push(processAchievement(achievement.children));
            }
        }
    }
    return result;
}

function processAchievement(achievement) {
    let img = achievement[0].children[0].currentSrc;
    let data = achievement[1];
    let title = data.children[0].children[0].children[0].innerHTML;
    let value;
    if (isXbox()) {
        value = parseInt(data.children[0].children[1].children[1].children[0].innerHTML);
    } else {
        value = data.children[0].children[1].children[1].children[0].children[0].src.split('trophy_')[1].split('.')[0];
        value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    let description = data.children[1].innerHTML;
    return {
        'picture': img,
        'title': title,
        'description': description,
        'value': value,
    };
}

function isXbox() {
    return window.location.href.includes('www.xboxachievements.com');
}

function replace(text) {
    return text.replaceAll('\'', '\'\'');
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
