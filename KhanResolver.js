let device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
};

let loadedPlugins = [];
let user = { nickname: "", username: "", UID: "" };
let khanwareDominates = true;

/* Elements */
const splashScreen = document.createElement('splashScreen');

/* Globals */
window.features = {
    questionSpoof: true,
    videoSpoof: true,
    autoAnswer: true,
    nextRecomendation: false,
    repeatQuestion: false
};
window.featureConfigs = {
    autoAnswerDelay: 1.1,
    customUsername: null,
    customPfp: null
};

/* Security */
document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
document.addEventListener('keydown', function (e) { if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'U' || e.key === 'J'))) e.preventDefault(); });

// Não deixar exibir erros no console
console.clear();
console.warn = function () { };
console.error = function () { };

/* Emmiter */
class EventEmitter { constructor() { this.events = {} } on(t, e) { "string" == typeof t && (t = [t]), t.forEach(t => { this.events[t] || (this.events[t] = []), this.events[t].push(e) }) } off(t, e) { "string" == typeof t && (t = [t]), t.forEach(t => { this.events[t] && (this.events[t] = this.events[t].filter(t => t !== e)) }) } emit(t, ...e) { this.events[t] && this.events[t].forEach(t => { t(...e) }) } once(t, e) { "string" == typeof t && (t = [t]); let s = (...i) => { e(...i), this.off(t, s) }; this.on(t, s) } };
const plppdo = new EventEmitter();

new MutationObserver((mutationsList) => { for (let mutation of mutationsList) if (mutation.type === 'childList') plppdo.emit('domChanged'); }).observe(document.body, { childList: true, subtree: true });

/* Misc Functions */
window.debug = function (text) { /* QuickFix */ }
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const findAndClickByClass = className => { const element = document.querySelector(`.${className}`); if (element) { element.click(); } }

function sendToast(text, duration = 5000, gravity = 'bottom') { Toastify({ text: text, duration: duration, gravity: gravity, position: "center", stopOnFocus: true, style: { background: "#000000" } }).showToast(); debug(text); };

async function showSplashScreen() { splashScreen.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.5s ease;user-select:none;color:white;font-size:30px;text-align:center;"; splashScreen.innerHTML = '<span style="color:white;">KHAN</span><span style="color:#9B1C31;">FUCKER</span>'; document.body.appendChild(splashScreen); setTimeout(() => splashScreen.style.opacity = '1', 10); };
async function hideSplashScreen() { splashScreen.style.opacity = '0'; setTimeout(() => splashScreen.remove(), 1000); };

async function loadScript(url, label) { return fetch(url).then(response => response.text()).then(script => { loadedPlugins.push(label); eval(script); }); }
async function loadCss(url) { return new Promise((resolve) => { const link = document.createElement('link'); link.rel = 'stylesheet'; link.type = 'text/css'; link.href = url; link.onload = () => resolve(); document.head.appendChild(link); }); }

/* Plugin: questionSpoof */
function setupQuestionSpoof() {
    const originalFetch = window.fetch;
    
    window.fetch = async function (input, init) {
        let body;
        if (input instanceof Request) body = await input.clone().text();
        else if (init && init.body) body = init.body;

        const originalResponse = await originalFetch.apply(this, arguments);
        const clonedResponse = originalResponse.clone();

        try {
            const responseBody = await clonedResponse.text();
            let responseObj = JSON.parse(responseBody);
            if (features.questionSpoof && responseObj?.data?.assessmentItem?.item?.itemData) {
                let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                if(itemData.question.content[0] === itemData.question.content[0].toUpperCase()){
                    itemData.answerArea = { "calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false }
                    itemData.question.content = " " + `[[☃ radio 1]]`;
                    itemData.question.widgets = { "radio 1": { options: { choices: [ { content: "✅┃Correta!", correct: true } ] } } };
                    responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                    return new Response(JSON.stringify(responseObj), { status: originalResponse.status, statusText: originalResponse.statusText, headers: originalResponse.headers });
                }
            }
        } catch (e) { debug(`🚨 Error @ questionSpoof\n${e}`); }
        return originalResponse;
    };
}

/* Plugin: videoSpoof */
function setupVideoSpoof() {
    const originalFetch = window.fetch;

    window.fetch = async function (input, init) {
        let body;
        if (input instanceof Request) body = await input.clone().text();
        else if (init && init.body) body = init.body;
        if (features.videoSpoof && body && body.includes('"operationName":"updateUserVideoProgress"')) {
            try {
                let bodyObj = JSON.parse(body);
                if (bodyObj.variables && bodyObj.variables.input) {
                    const durationSeconds = bodyObj.variables.input.durationSeconds;
                    bodyObj.variables.input.secondsWatched = durationSeconds;
                    bodyObj.variables.input.lastSecondWatched = durationSeconds;
                    body = JSON.stringify(bodyObj);
                    if (input instanceof Request) { input = new Request(input, { body: body }); } 
                    else init.body = body; 
                }
            } catch (e) { debug(`🚨 Error @ videoSpoof\n${e}`); }
        }
        return originalFetch.apply(this, arguments);
    };
}

/* Plugin: spoofUser */
function setupSpoofUser() {
    plppdo.on('domChanged', () => {
        if(!device.apple){
            const pfpElement = document.querySelector('.avatar-pic');
            const nicknameElement = document.querySelector('.user-deets.editable h2');
            if (nicknameElement) nicknameElement.textContent = featureConfigs.customUsername || user.nickname; 
            if (featureConfigs.customPfp && pfpElement) { Object.assign(pfpElement, { src: featureConfigs.customPfp, alt: "Not an image URL"} );pfpElement.style.borderRadius="50%"}
        }
    });
}

/* Plugin: autoAnswer */
function setupAutoAnswer() {
    const baseClasses = ["_19uopuu", "_ssxvf9l", "_1r8cd7xe", "_1yok8f4", "_4i5p5ae", "_s6zfc1u"];
    
    (async () => { 
        while (khanwareDominates) {
            if (features.autoAnswer && features.questionSpoof) {
                
                const classToCheck = [...baseClasses];

                if (features.nextRecomendation)  device.mobile ? classToCheck.push("_ixuggsz") : classToCheck.push("_1kkrg8oi");
                if (features.repeatQuestion) classToCheck.push("_ypgawqo");

                for (const q of classToCheck) {
                    findAndClickByClass(q);
                    const element = document.getElementsByClassName(q)[0];
                    if (element && element.textContent === "Mostrar resumo") {
                        sendToast("🎉┃Exercício concluído!", 3000);
                    }
                }
            }
            await delay(featureConfigs.autoAnswerDelay * 750);
        }
    })();
}

/* Main Setup */
function setupMain() {
    // Em vez de carregar externamente, agora configuramos diretamente
    setupQuestionSpoof();
    setupVideoSpoof();
    setupSpoofUser();
    setupAutoAnswer();
    
    // Registrar que os plugins foram carregados
    loadedPlugins.push('questionSpoof');
    loadedPlugins.push('videoSpoof');
    loadedPlugins.push('spoofUser');
    loadedPlugins.push('autoAnswer');
}

/* Inject */
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) { window.location.href = "https://pt.khanacademy.org/"; }

showSplashScreen();

loadScript('https://cdn.jsdelivr.net/npm/darkreader', 'darkReaderPlugin').then(() => { DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); })
loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css', 'toastifyCss');
loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
    .then(async () => {
        await fetch(`https://${location.hostname}/api/internal/graphql/getFullUserProfile`, { "body": "{\"operationName\":\"getFullUserProfile\",\"query\":\"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\\"can_do_what_only_admins_can_do\\\")\\n    isPublisher: hasPermission(name: \\\"can_publish\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\\"can_moderate_users\\\", scope: GLOBAL)\\n    isParent\\n    isTeacher\\n    isFormalTeacher\\n    isK4dStudent\\n    isKmapStudent\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    profile {\\n      accessLevel\\n      __typename\\n    }\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\\"can_ban_users\\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(\\n      name: \\\"can_send_moderator_messages\\\"\\n      scope: GLOBAL\\n    )\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    includesKmapDistrictOwnedData\\n    includesK4dDistrictOwnedData\\n    canAccessDistrictsHomepage\\n    preferredKaLocale {\\n      id\\n      kaLocale\\n      status\\n      __typename\\n    }\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      __typename\\n    }\\n    hasAccessToAIGuideCompanionMode\\n    hasAccessToAIGuideLearner\\n    hasAccessToAIGuideDistrictAdmin\\n    hasAccessToAIGuideParent\\n    hasAccessToAIGuideTeacher\\n    tosAccepted\\n    shouldShowAgeCheck\\n    birthMonthYear\\n    lastLoginCountry\\n    region\\n    userDistrictInfos {\\n      id\\n      isKAD\\n      district {\\n        id\\n        region\\n        __typename\\n      }\\n      __typename\\n    }\\n    schoolAffiliation {\\n      id\\n      location\\n      __typename\\n    }\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n  isAIGuideEnabled\\n  hasAccessToAIGuideDev\\n}\"}", "method": "POST", "mode": "cors", "credentials": "include" })
            .then(async response => { let data = await response.json(); user = { nickname: data.data.user.nickname, username: data.data.user.username, UID: data.data.user.id.slice(-5) }; })

        await delay(2000);

        sendToast("💢┃KhanFucker iniciado!");

        hideSplashScreen();
        setupMain();

        console.clear();
        console.log(" \n  ______          _    \n |  ____|        | |   \n | |__ _   _  ___| | __\n |  __| | | |/ __| |/ /\n | |  | |_| | (__|   < \n |_|   \\__,_|\\___|_|\\_\\\n ");
    });
