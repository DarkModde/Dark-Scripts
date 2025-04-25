let device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
};

let loadedPlugins = [];
let user = { nickname: "Usuário", username: "khan_user", UID: "00000" };
let khanwareDominates = true;

const splashScreen = document.createElement('div');
splashScreen.id = 'khanfucker-splash';

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

document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
document.addEventListener('keydown', function(e) { 
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'U' || e.key === 'J'))) {
        e.preventDefault(); 
    }
});

console.clear();
console.warn = function() {};
console.error = function() {};
window.debug = function() {};

class EventEmitter { 
    constructor() { this.events = {} } 
    on(t, e) { "string" == typeof t && (t = [t]); t.forEach(t => { this.events[t] || (this.events[t] = []), this.events[t].push(e) }) } 
    off(t, e) { "string" == typeof t && (t = [t]); t.forEach(t => { this.events[t] && (this.events[t] = this.events[t].filter(t => t !== e)) }) } 
    emit(t, ...e) { this.events[t] && this.events[t].forEach(t => { t(...e) }) } 
    once(t, e) { "string" == typeof t && (t = [t]); let s = (...i) => { e(...i), this.off(t, s) }; this.on(t, s) } 
}

const plppdo = new EventEmitter();
new MutationObserver((mutationsList) => { 
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            plppdo.emit('domChanged');
        }
    } 
}).observe(document.body, { childList: true, subtree: true });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const findAndClickByClass = className => { 
    const element = document.querySelector(`.${className}`); 
    if (element) { element.click(); return true; }
    return false;
}

function sendToast(text, duration = 5000, gravity = 'bottom', background = "#000000") { 
    if (typeof Toastify === 'function') {
        Toastify({ 
            text: text, 
            duration: duration, 
            gravity: gravity, 
            position: "center", 
            stopOnFocus: true, 
            style: { background: background } 
        }).showToast(); 
    }
}

function showSplashScreen() { 
    splashScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        opacity: 0;
        transition: opacity 0.5s ease;
        user-select: none;
        color: white;
        font-size: 30px;
        text-align: center;
    `; 
    splashScreen.innerHTML = '<span style="color:white;">KHAN</span><span style="color:#9B1C31;">FUCKER</span>'; 
    document.body.appendChild(splashScreen); 
    splashScreen.getBoundingClientRect();
    splashScreen.style.opacity = '1';
    return Promise.resolve();
}

function hideSplashScreen() {
    if (!document.body.contains(splashScreen)) {
        return Promise.resolve();
    }
    
    splashScreen.style.opacity = '0';
    
    return new Promise(resolve => {
        setTimeout(() => {
            try {
                if (document.body.contains(splashScreen)) {
                    document.body.removeChild(splashScreen);
                }
            } catch(e) {}
            resolve();
        }, 1000);
    });
}

async function loadScript(url, label) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error();
        }
        
        const script = await response.text();
        loadedPlugins.push(label);
        eval(script);
        return true;
    } catch (error) {
        return false;
    }
}

async function loadCss(url) {
    return new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        
        link.onload = () => resolve(true);
        link.onerror = () => resolve(false);
        
        document.head.appendChild(link);
    });
}

function setupSpoofers() {
    const originalFetch = window.fetch;
    
    window.fetch = async function(input, init) {
        let url = '';
        let body = '';
        
        if (input instanceof Request) {
            url = input.url;
            try { body = await input.clone().text(); } catch(e) {}
        } else {
            url = input;
            if (init && init.body) {
                body = init.body;
            }
        }
        
        if (features.videoSpoof && body && body.includes('"operationName":"updateUserVideoProgress"')) {
            try {
                let bodyObj = JSON.parse(body);
                if (bodyObj.variables && bodyObj.variables.input) {
                    const durationSeconds = bodyObj.variables.input.durationSeconds;
                    bodyObj.variables.input.secondsWatched = durationSeconds;
                    bodyObj.variables.input.lastSecondWatched = durationSeconds;
                    
                    const newBody = JSON.stringify(bodyObj);
                    
                    if (input instanceof Request) {
                        input = new Request(input, { body: newBody });
                    } else if (init) {
                        init.body = newBody;
                    }
                }
            } catch (e) {}
        }
        
        const response = await originalFetch.apply(this, arguments);
        
        if (features.questionSpoof && response.ok) {
            try {
                const responseClone = response.clone();
                const responseText = await responseClone.text();
                
                if (responseText && responseText.length > 0) {
                    try {
                        const responseObj = JSON.parse(responseText);
                        
                        if (responseObj?.data?.assessmentItem?.item?.itemData) {
                            let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                            
                            if (itemData.question && 
                                itemData.question.content && 
                                itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
                                
                                itemData.answerArea = {
                                    "calculator": false,
                                    "chi2Table": false,
                                    "periodicTable": false,
                                    "tTable": false,
                                    "zTable": false
                                };
                                
                                itemData.question.content = " " + `[[☃ radio 1]]`;
                                itemData.question.widgets = {
                                    "radio 1": {
                                        options: {
                                            choices: [
                                                { content: "✅┃Correta!", correct: true }
                                            ]
                                        }
                                    }
                                };
                                
                                responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                                
                                return new Response(JSON.stringify(responseObj), {
                                    status: response.status,
                                    statusText: response.statusText,
                                    headers: response.headers
                                });
                            }
                        }
                    } catch (e) {}
                }
            } catch (e) {}
        }
        
        return response;
    };
    
    sendToast("✅┃Spoofers ativados!", 2000);
}

function setupSpoofUser() {
    plppdo.on('domChanged', () => {
        if (!device.apple) {
            const pfpElement = document.querySelector('.avatar-pic');
            const nicknameElement = document.querySelector('.user-deets.editable h2');
            
            if (nicknameElement) {
                nicknameElement.textContent = featureConfigs.customUsername || user.nickname;
            }
            
            if (featureConfigs.customPfp && pfpElement) {
                Object.assign(pfpElement, { 
                    src: featureConfigs.customPfp, 
                    alt: "Profile picture"
                });
                pfpElement.style.borderRadius = "50%";
            }
        }
    });
    
    sendToast("👤┃Spoofer de perfil ativado!", 2000);
}

function setupAutoAnswer() {
    const baseClasses = ["_19uopuu", "_ssxvf9l", "_1r8cd7xe", "_1yok8f4", "_4i5p5ae", "_s6zfc1u"];
    let lastExerciseComplete = false;
    
    (async () => {
        while (khanwareDominates) {
            try {
                if (features.autoAnswer && features.questionSpoof) {
                    const classToCheck = [...baseClasses];
                    
                    if (features.nextRecomendation) {
                        if (device.mobile) {
                            classToCheck.push("_ixuggsz");
                        } else {
                            classToCheck.push("_1kkrg8oi");
                        }
                    }
                    
                    if (features.repeatQuestion) {
                        classToCheck.push("_ypgawqo");
                    }
                    
                    for (const className of classToCheck) {
                        const elements = document.getElementsByClassName(className);
                        
                        if (elements.length > 0) {
                            const element = elements[0];
                            
                            if (element.textContent === "Mostrar resumo") {
                                if (!lastExerciseComplete) {
                                    sendToast("🎉┃Exercício concluído!", 3000);
                                    lastExerciseComplete = true;
                                }
                            } else {
                                lastExerciseComplete = false;
                                element.click();
                            }
                        }
                    }
                }
            } catch (error) {}
            
            await delay(featureConfigs.autoAnswerDelay * 750);
        }
    })();
    
    sendToast("🤖┃AutoAnswer ativado!", 2000);
}

function setupMain() {
    try {
        setupSpoofers();
        setupSpoofUser();
        setupAutoAnswer();
        
        loadedPlugins.push('questionSpoof');
        loadedPlugins.push('videoSpoof');
        loadedPlugins.push('spoofUser');
        loadedPlugins.push('autoAnswer');
        
        sendToast("✅┃Todos os plugins carregados!", 3000);
    } catch (error) {
        sendToast("⚠️┃Erro ao configurar plugins!", 5000);
    }
}

(async function() {
    if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
        window.location.href = "https://pt.khanacademy.org/";
        return;
    }
    
    try {
        await showSplashScreen();
        
        try {
            await Promise.all([
                loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'),
                loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
            ]);
            
            if (typeof DarkReader !== 'undefined') {
                DarkReader.enable();
            }
        } catch (error) {}
        
        try {
            user.nickname = document.querySelector(".nickname")?.textContent || "Usuário";
        } catch (error) {}
        
        sendToast(`👋┃Olá, ${user.nickname}!`, 3000);
        await delay(1000);
        
        sendToast("💢┃KhanFucker iniciado!");
        
        setupMain();
        
        // Forçar remoção da tela de splash
        try {
            await hideSplashScreen();
        } catch (e) {
            if (document.body.contains(splashScreen)) {
                document.body.removeChild(splashScreen);
            }
        }
        
        console.clear();
        console.log(" \n  ______          _    \n |  ____|        | |   \n | |__ _   _  ___| | __\n |  __| | | |/ __| |/ /\n | |  | |_| | (__|   < \n |_|   \\__,_|\\___|_|\\_\\\n ");
        
    } catch (error) {
        try {
            if (document.body.contains(splashScreen)) {
                document.body.removeChild(splashScreen);
            }
        } catch (e) {}
    }
})();
