// Script desenvolvido por inacallep ( Fandangos )
// Eu apenas roubei ( ÓBVIO ), modifiquei, aprimorei
// e também deixei mais bonito KKKK

const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/DarkModde/Dark-Scripts/ProtectionScript.js';
document.head.appendChild(script);

(async () => {
    console.clear();
    const noop = () => {};
    console.warn = console.error = window.debug = noop;
    
    class NotificationSystem {
        constructor() {
            this.initStyles();
            this.notificationContainer = this.createContainer();
            document.body.appendChild(this.notificationContainer);
        }

        initStyles() {
            const styleId = 'custom-notification-styles';
            if (document.getElementById(styleId)) return;

            const css = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    pointer-events: none;
                }
                .notification {
                    background: rgba(20, 20, 20, 0.9);
                    color: #f0f0f0;
                    margin-bottom: 10px;
                    padding: 12px 18px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    backdrop-filter: blur(8px);
                    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    font-size: 13.5px;
                    width: 280px;
                    min-height: 50px;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                    pointer-events: auto;
                    opacity: 0;
                    transform: translateY(-20px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                .notification.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                .notification-icon {
                    margin-right: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .notification-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    width: 100%;
                    background: #f0f0f0;
                    opacity: 0.8;
                }
                @keyframes progress-animation {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .notification-progress.animate {
                    animation: progress-animation linear forwards;
                }
                .notification.success .notification-icon {
                    color: #4caf50;
                }
                .notification.error .notification-icon {
                    color: #f44336;
                }
                .notification.info .notification-icon {
                    color: #2196f3;
                }
                .notification.warning .notification-icon {
                    color: #ff9800;
                }
            `;

            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = css;
            document.head.appendChild(style);
        }

        createContainer() {
            const container = document.createElement('div');
            container.className = 'notification-container';
            return container;
        }

        createIcon(type) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'notification-icon';
            
            let iconSvg = '';
            
            switch(type) {
                case 'success':
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
                    break;
                case 'error':
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
                    break;
                case 'warning':
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
                    break;
                case 'info':
                default:
                    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
            }
            
            iconWrapper.innerHTML = iconSvg;
            return iconWrapper;
        }

        show(message, options = {}) {
            const { duration = 5000, type = 'info' } = options;
            
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            
            const icon = this.createIcon(type);
            notification.appendChild(icon);
            
            const textSpan = document.createElement('span');
            textSpan.textContent = message;
            notification.appendChild(textSpan);
            
            const progressBar = document.createElement('div');
            progressBar.className = 'notification-progress';
            notification.appendChild(progressBar);
            
            this.notificationContainer.appendChild(notification);
            
            notification.offsetHeight;
            notification.classList.add('show');
            
            progressBar.classList.add('animate');
            progressBar.style.animationDuration = `${duration}ms`;
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        this.notificationContainer.removeChild(notification);
                    }
                }, 300);
            }, duration);
            
            return notification;
        }
        
        success(message, duration = 5000) {
            return this.show(message, { type: 'success', duration });
        }
        
        error(message, duration = 5000) {
            return this.show(message, { type: 'error', duration });
        }
        
        info(message, duration = 5000) {
            return this.show(message, { type: 'info', duration });
        }
        
        warning(message, duration = 5000) {
            return this.show(message, { type: 'warning', duration });
        }
    }

    function removeHtmlTags(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString || '';
        return div.textContent || div.innerText || '';
    }

    function transformJson(jsonOriginal) {
        if (!jsonOriginal?.task?.questions) {
            throw new Error("Estrutura de dados inválida para transformação.");
        }

        const novoJson = {
            accessed_on: jsonOriginal.accessed_on,
            executed_on: jsonOriginal.executed_on,
            answers: {}
        };

        for (const questionId in jsonOriginal.answers) {
            const questionData = jsonOriginal.answers[questionId];
            const taskQuestion = jsonOriginal.task.questions.find(q => q.id === parseInt(questionId));

            if (!taskQuestion) continue;

            const answerPayload = {
                question_id: questionData.question_id,
                question_type: taskQuestion.type,
                answer: null
            };

            try {
                switch (taskQuestion.type) {
                    case "order-sentences":
                        if (taskQuestion.options?.sentences?.length) {
                            answerPayload.answer = taskQuestion.options.sentences.map(sentence => sentence.value);
                        }
                        break;
                    case "fill-words":
                        if (taskQuestion.options?.phrase?.length) {
                            answerPayload.answer = taskQuestion.options.phrase
                                .map(item => item.value)
                                .filter((_, index) => index % 2 !== 0);
                        }
                        break;
                    case "text_ai":
                        answerPayload.answer = { "0": removeHtmlTags(taskQuestion.comment || '') };
                        break;
                    case "fill-letters":
                        if (taskQuestion.options?.answer !== undefined) {
                            answerPayload.answer = taskQuestion.options.answer;
                        }
                        break;
                    case "cloud":
                        if (taskQuestion.options?.ids?.length) {
                            answerPayload.answer = taskQuestion.options.ids;
                        }
                        break;
                    default:
                        if (taskQuestion.options && typeof taskQuestion.options === 'object') {
                            answerPayload.answer = Object.fromEntries(
                                Object.keys(taskQuestion.options).map(optionId => {
                                    const optionData = taskQuestion.options[optionId];
                                    const answerValue = optionData?.answer !== undefined ? optionData.answer : false;
                                    return [optionId, answerValue];
                                })
                            );
                        }
                        break;
                }
                novoJson.answers[questionId] = answerPayload;
            } catch (err) {
                notifications.error(`Erro processando questão ${questionId}.`, 5000);
            }
        }
        return novoJson;
    }

    async function pegarRespostasCorretas(taskId, answerId, headers) {
        const url = `https://edusp-api.ip.tv/tms/task/${taskId}/answer/${answerId}?with_task=true&with_genre=true&with_questions=true&with_assessed_skills=true`;
        
        const response = await fetch(url, { method: "GET", headers });
        if (!response.ok) {
            throw new Error(`Erro ${response.status} ao buscar respostas.`);
        }
        return await response.json();
    }

    async function enviarRespostasCorrigidas(respostasAnteriores, taskId, answerId, headers) {
        const url = `https://edusp-api.ip.tv/tms/task/${taskId}/answer/${answerId}`;
        
        try {
            const novasRespostasPayload = transformJson(respostasAnteriores);

            const response = await fetch(url, {
                method: "PUT",
                headers,
                body: JSON.stringify(novasRespostasPayload)
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status} ao enviar respostas.`);
            }

            notifications.success("Tarefa corrigida com sucesso!", 6000);
        } catch (error) {}
    }

    async function loadCss(url) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`link[href="${url}"]`)) {
                resolve();
                return;
            }
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            link.onload = resolve;
            link.onerror = () => reject(new Error(`Falha ao carregar ${url}`));
            document.head.appendChild(link);
        });
    }

    let capturedLoginData = null;
    const originalFetch = window.fetch;
    const notifications = new NotificationSystem();

    function enableSecurityMeasures() {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.msUserSelect = 'none';
        document.body.style.mozUserSelect = 'none';
        
        document.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });
        
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            img, svg, canvas, video {
                pointer-events: none !important;
                -webkit-user-drag: none !important;
            }
        `;
        document.head.appendChild(styleElement);
    }

    try {
        await Promise.all([
            loadCss('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap'),
        ]);
        notifications.success(`TarefasResolver iniciado com sucesso!`, 3000);
        notifications.info("Aguardando o login no Sala do Futuro...", 6000);
        enableSecurityMeasures();
    } catch (error) {
        return;
    }

    window.fetch = async function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        const method = init?.method || 'GET';

        if (url === 'https://edusp-api.ip.tv/registration/edusp/token' && !capturedLoginData) {
            try {
                const response = await originalFetch.apply(this, arguments);
                const clonedResponse = response.clone();
                const data = await clonedResponse.json();

                if (data?.auth_token) {
                    capturedLoginData = data;
                    setTimeout(() => {
                        notifications.success(`Login bem-sucedido! Divirta-se e faça as tarefas.`, 3500);
                    }, 250);
                }
                return response;
            } catch (error) {
                notifications.error("Erro ao capturar token.", 5000);
                return originalFetch.apply(this, arguments);
            }
        }

        const response = await originalFetch.apply(this, arguments);

        const answerSubmitRegex = /^https:\/\/edusp-api\.ip\.tv\/tms\/task\/\d+\/answer$/;
        if (answerSubmitRegex.test(url) && init?.method === 'POST') {
            if (!capturedLoginData?.auth_token) {
                return response;
            }

            try {
                const clonedResponse = response.clone();
                const submittedData = await clonedResponse.json();

                if (submittedData?.status !== "draft" && submittedData?.id && submittedData?.task_id) {
                    notifications.info("Envio detectado! Iniciando correção...", 4000);

                    const headers = {
                        "x-api-realm": "edusp",
                        "x-api-platform": "webclient",
                        "x-api-key": capturedLoginData.auth_token,
                        "content-type": "application/json"
                    };

                    setTimeout(async () => {
                        try {
                            const respostas = await pegarRespostasCorretas(submittedData.task_id, submittedData.id, headers);
                            await enviarRespostasCorrigidas(respostas, submittedData.task_id, submittedData.id, headers);
                        } catch (error) {
                            notifications.error("Erro na correção automática.", 5000);
                        }
                    }, 500);
                }
            } catch (err) {
                notifications.error("Erro ao processar envio.", 5000);
            }
        }

        return response;
    };
})();
