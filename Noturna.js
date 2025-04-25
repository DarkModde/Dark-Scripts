function extractUrlParam(url, paramName) {
  try {
    return new URL(url).searchParams.get(paramName);
  } catch {
    return null;
  }
}

function extractByRegex(text, regex, errorMessage) {
  const match = text.match(regex);
  if (!match || !match[1]) {
    throw new Error(errorMessage);
  }
  return match[1];
}

class RequestManager {
  constructor(baseUrl = 'https://expansao.educacao.sp.gov.br', maxRetries = 3) {
    this.baseUrl = baseUrl;
    this.maxRetries = maxRetries;
  }

  async fetchWithRetry(url, options = {}, retries = this.maxRetries) {
    try {
      const response = await fetch(url, {
        credentials: 'include',
        ...options
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (retries > 0 && error.message.includes('429')) {
        const delay = Math.pow(2, this.maxRetries - retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }

  createUrl(path, params = {}) {
    const url = new URL(path, this.baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  }
}

class ExamAutomator {
  constructor() {
    this.requestManager = new RequestManager();
  }

  async fetchExamPage(examUrl) {
    const response = await this.requestManager.fetchWithRetry(examUrl);
    const pageText = await response.text();
    
    return {
      contextId: extractUrlParam(examUrl, 'id') || 
                 extractByRegex(pageText, /contextInstanceId":(\d+)/, "CMID não encontrado"),
      sessKey: extractByRegex(pageText, /sesskey":"([^"]+)/, "Sesskey não encontrado")
    };
  }

  async startExamAttempt(contextId, sessKey) {
    const url = this.requestManager.createUrl('/mod/quiz/startattempt.php');
    const params = new URLSearchParams({
      cmid: contextId,
      sesskey: sessKey
    });

    const response = await this.requestManager.fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString(),
      redirect: 'follow'
    });

    const redirectUrl = response.url;
    const attemptMatch = redirectUrl.match(/attempt=(\d+)/);
    
    if (!attemptMatch?.[1]) {
      throw new Error("ID da tentativa não encontrado");
    }

    return {
      redirectUrl,
      attemptId: attemptMatch[1]
    };
  }

  async extractQuestionInfo(questionUrl) {
    const response = await this.requestManager.fetchWithRetry(questionUrl);
    const pageText = await response.text();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(pageText, "text/html");

    const questionData = {
      questId: null,
      seqCheck: null,
      options: [],
      attempt: null,
      sesskey: null,
      formFields: {}
    };

    const hiddenInputs = htmlDoc.querySelectorAll("input[type='hidden']");
    hiddenInputs.forEach(input => {
      const name = input.getAttribute("name");
      const value = input.getAttribute("value");

      if (!name) return;

      if (name.includes(":sequencecheck")) {
        questionData.questId = name.split(":")[0];
        questionData.seqCheck = value;
      } else if (name === "attempt") {
        questionData.attempt = value;
      } else if (name === "sesskey") {
        questionData.sesskey = value;
      } else if (["thispage", "nextpage", "timeup", "mdlscrollto", "slots"].includes(name)) {
        questionData.formFields[name] = value;
      }
    });

    const radioInputs = htmlDoc.querySelectorAll("input[type='radio']");
    radioInputs.forEach(input => {
      const name = input.getAttribute("name");
      const value = input.getAttribute("value");

      if (name?.includes("_answer") && value !== "-1") {
        questionData.options.push({ name, value });
      }
    });

    if (!questionData.questId || !questionData.attempt || 
        !questionData.sesskey || questionData.options.length === 0) {
      throw new Error("Informações insuficientes na página da questão");
    }

    return questionData;
  }

  async submitAnswer(questionData, contextId) {
    const selectedOption = questionData.options[
      Math.floor(Math.random() * questionData.options.length)
    ];

    const formData = new FormData();

    formData.append(`${questionData.questId}:1_:flagged`, "0");
    formData.append(`${questionData.questId}:1_:sequencecheck`, questionData.seqCheck);
    formData.append(selectedOption.name, selectedOption.value);
    formData.append("next", "Finalizar tentativa ...");
    formData.append("attempt", questionData.attempt);
    formData.append("sesskey", questionData.sesskey);
    formData.append("slots", "1");

    Object.entries(questionData.formFields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const url = this.requestManager.createUrl(`/mod/quiz/processattempt.php?cmid=${contextId}`);
    const response = await this.requestManager.fetchWithRetry(url, {
      method: "POST",
      body: formData,
      redirect: "follow"
    });

    return {
      redirectUrl: response.url,
      attemptId: questionData.attempt,
      sesskey: questionData.sesskey
    };
  }

  async finishExamAttempt(attemptId, contextId, sesskey) {
    const summaryUrl = this.requestManager.createUrl(`/mod/quiz/summary.php`, {
      attempt: attemptId,
      cmid: contextId
    });

    await this.requestManager.fetchWithRetry(summaryUrl);

    const params = new URLSearchParams({
      attempt: attemptId,
      finishattempt: "1",
      timeup: "0",
      slots: "",
      cmid: contextId,
      sesskey: sesskey
    });

    const url = this.requestManager.createUrl('/mod/quiz/processattempt.php');
    const response = await this.requestManager.fetchWithRetry(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString(),
      redirect: "follow"
    });

    return response.url;
  }

  async completeExam(examUrl) {
    try {
      const { contextId, sessKey } = await this.fetchExamPage(examUrl);
      const { redirectUrl, attemptId } = await this.startExamAttempt(contextId, sessKey);
      const questionData = await this.extractQuestionInfo(redirectUrl);
      const { attemptId: finalAttemptId, sesskey } = await this.submitAnswer(
        questionData, 
        contextId
      );

      return await this.finishExamAttempt(finalAttemptId, contextId, sesskey);
    } catch (error) {
      console.error("Erro ao completar exame:", error);
      throw error;
    }
  }
}

class PageCompletionService {
  constructor(baseUrl = 'https://expansao.educacao.sp.gov.br') {
    this.baseUrl = baseUrl;
  }

  async markPageAsCompleted(pageId) {
    try {
      const url = new URL(`/mod/resource/view.php?id=${pageId}`, this.baseUrl);
      
      await fetch(url.toString(), {
        credentials: 'include',
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/118.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'same-origin'
        }
      });
    } catch (error) {
      console.error(`Erro ao marcar página ${pageId} como concluída:`, error);
    }
  }
}

class ActivityProcessorUI {
  constructor() {
    this.examAutomator = new ExamAutomator();
    this.pageCompletionService = new PageCompletionService();
  }

  createLoadingOverlay() {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      background: rgba(0,0,0,0.8); 
      display: flex; 
      flex-direction: column; 
      justify-content: center; 
      align-items: center; 
      z-index: 9999;
    `;

    const spinner = document.createElement("div");
    spinner.style.cssText = `
      border: 16px solid #f3f3f3; 
      border-radius: 50%; 
      border-top: 16px solid #3498db; 
      width: 120px; 
      height: 120px; 
      animation: spin 2s linear infinite; 
      margin-bottom: 20px;
    `;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin { 
        0% { transform: rotate(0deg); } 
        100% { transform: rotate(360deg); } 
      }
    `;

    const loadingText = document.createElement("div");
    loadingText.style.cssText = "color: white; font-size: 24px; font-weight: bold; text-align: center;";
    loadingText.innerText = "Processando atividades...";

    const progressText = document.createElement("div");
    progressText.style.cssText = "color: white; font-size: 18px; margin-top: 10px;";

    document.head.appendChild(style);
    overlay.appendChild(spinner);
    overlay.appendChild(loadingText);
    overlay.appendChild(progressText);

    return {
      overlay,
      progressText
    };
  }

  async processActivities() {
    alert("Script feito por marcos10pc | discord.gg/platformdestroyer");

    const { overlay, progressText } = this.createLoadingOverlay();
    document.body.appendChild(overlay);

    try {
      const activities = Array.from(document.querySelectorAll("li.activity"))
        .filter(activity => {
          const link = activity.querySelector("a.aalink");
          const completionButton = activity.querySelector(".completion-dropdown button");
          return link && link.href && 
                 (!completionButton || !completionButton.classList.contains("btn-success"));
        });

      const simplePages = [];
      const exams = [];

      activities.forEach(activity => {
        const link = activity.querySelector("a.aalink");
        const url = new URL(link.href);
        const pageId = url.searchParams.get("id");
        const activityName = link.textContent.trim();

        if (pageId) {
          if (/responda|pause/i.test(activityName)) {
            exams.push({ href: link.href, nome: activityName });
          } else {
            simplePages.push(pageId);
          }
        }
      });

      progressText.innerText = `Marcando ${simplePages.length} atividades como concluídas...`;
      await Promise.all(simplePages.map(pageId => 
        this.pageCompletionService.markPageAsCompleted(pageId)
      ));

      const totalExams = exams.length;
      for (let i = 0; i < totalExams; i++) {
        const exam = exams[i];
        progressText.innerText = `Processando exame ${i + 1}/${totalExams}: "${exam.nome}"`;
        
        try {
          await this.examAutomator.completeExam(exam.href);
        } catch (error) {
          console.error(`Erro ao processar exame: ${exam.nome}`, error);
        }

        if (i < totalExams - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }

      alert("Atividades Finalizadas! | Caso Sobrar alguma execute denovo");
    } catch (error) {
      console.error("Erro no processamento de atividades:", error);
      alert("Ocorreu um erro durante o processamento");
    } finally {
      document.body.removeChild(overlay);
      location.reload();
    }
  }
}

function initActivityProcessor() {
  if (window.location.hostname !== 'expansao.educacao.sp.gov.br') {
    alert('Este script só funciona no site da Expansão Educacional de SP');
    return;
  }

  const processor = new ActivityProcessorUI();
  processor.processActivities();
}

initActivityProcessor();
