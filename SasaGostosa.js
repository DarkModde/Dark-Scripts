const API_KEY = 'AIzaSyBuQ9CbOgBi1CXgG9hIi5hasu3TJBw5Dqo';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function createMenu() {
    if (document.getElementById('gemini-assistant')) return;
    
    const menu = document.createElement('div');
    menu.id = 'gemini-assistant';
    menu.style = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 420px;
        background: #1a1a1a;
        color: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `;

    const header = document.createElement('div');
    header.style = `
        background: #000;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        border-bottom: 1px solid #333;
        user-select: none;
    `;

    const title = document.createElement('div');
    title.innerHTML = '🔮 <b>Assistente Gemini</b>';
    title.style = 'font-size: 16px;';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style = `
        background: #333;
        border: none;
        color: #fff;
        cursor: pointer;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    closeBtn.onclick = () => menu.remove();

    const timerSection = document.createElement('div');
    timerSection.style = `
        padding: 12px 16px;
        background: #222;
        border-bottom: 1px solid #333;
        display: flex;
        gap: 8px;
        align-items: center;
    `;

    const timerInput = document.createElement('input');
    timerInput.type = 'number';
    timerInput.placeholder = 'Minutos';
    timerInput.min = '1';
    timerInput.style = `
        background: #333;
        border: 1px solid #444;
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        width: 80px;
    `;

    const timerBtn = document.createElement('button');
    timerBtn.textContent = '⏰ Iniciar Timer';
    timerBtn.style = `
        background: #7e57c2;
        border: none;
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
    `;

    const timerDisplay = document.createElement('div');
    timerDisplay.id = 'timer-display';
    timerDisplay.style = `
        margin-left: auto;
        font-size: 14px;
        color: #bbb;
    `;

    const content = document.createElement('div');
    content.id = 'gemini-content';
    content.style = `
        padding: 16px;
        overflow-y: auto;
        flex-grow: 1;
        background: #1a1a1a;
        scrollbar-width: thin;
        scrollbar-color: #444 #1a1a1a;
    `;

    content.innerHTML = `
        <style>
            #gemini-content::-webkit-scrollbar {
                width: 8px;
            }
            #gemini-content::-webkit-scrollbar-track {
                background: #1a1a1a;
            }
            #gemini-content::-webkit-scrollbar-thumb {
                background: #444;
                border-radius: 4px;
            }
            #gemini-content::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        </style>
    `;

    header.appendChild(title);
    header.appendChild(closeBtn);
    
    timerSection.appendChild(timerInput);
    timerSection.appendChild(timerBtn);
    timerSection.appendChild(timerDisplay);
    
    menu.appendChild(header);
    menu.appendChild(timerSection);
    menu.appendChild(content);
    document.body.appendChild(menu);

    let isDragging = false;
    let offset = [0, 0];
    let timerInterval = null;

    header.addEventListener('mousedown', function(e) {
        isDragging = true;
        offset = [menu.offsetLeft - e.clientX, menu.offsetTop - e.clientY];
    });

    document.addEventListener('mousemove', function(e) {
        e.preventDefault();
        if (isDragging) {
            menu.style.left = (e.clientX + offset[0]) + 'px';
            menu.style.top = (e.clientY + offset[1]) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    timerBtn.addEventListener('click', function() {
        const minutes = parseInt(timerInput.value);
        if (minutes && minutes > 0) {
            startTimer(minutes);
        }
    });

    function startTimer(minutes) {
        if (timerInterval) clearInterval(timerInterval);
        
        let timeLeft = minutes * 60;
        updateTimerDisplay(timeLeft);
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerDisplay.innerHTML = '⏰ <b>Tempo esgotado!</b>';
                timerDisplay.style.color = '#ff4757';
            }
        }, 1000);
    }

    function updateTimerDisplay(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.innerHTML = `⏳ ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        timerDisplay.style.color = seconds <= 60 ? '#ff4757' : '#4cd964';
    }

    return content;
}

function addMessageToMenu(message, type = 'info') {
    const content = document.getElementById('gemini-content');
    if (!content) return;

    const messageDiv = document.createElement('div');
    messageDiv.style = `
        margin-bottom: 16px;
        padding: 12px;
        border-radius: 8px;
        background: ${type === 'answer' ? '#2a2a2a' : '#222'};
        border-left: 4px solid ${type === 'answer' ? '#7e57c2' : '#4285f4'};
        font-size: 14px;
        line-height: 1.5;
    `;

    messageDiv.innerHTML = message;
    content.appendChild(messageDiv);
    content.scrollTop = content.scrollHeight;
}

function extractQuestions() {
    const questions = [];
    const questionDivs = document.querySelectorAll('div.takeQuestionDiv');
    
    questionDivs.forEach((div, index) => {
        const questionText = div.querySelector('.legend-visible .vtbegenerated').textContent.trim();
        const options = [];
        
        const optionElements = div.querySelectorAll('table.multiple-choice-table tr');
        optionElements.forEach(tr => {
            const letter = tr.querySelector('.multiple-choice-numbering').textContent.trim();
            const text = tr.querySelector('.vtbegenerated label').textContent.trim();
            options.push({ letter, text });
        });
        
        questions.push({
            number: index + 1,
            question: questionText,
            options: options,
            questionId: div.id
        });
    });
    
    return questions;
}

async function getGeminiAnswer(questionData) {
    const prompt = `
    Para a seguinte pergunta, responda APENAS com a letra da alternativa correta (a, b, c, d ou e):
    
    Pergunta: ${questionData.question}
    
    Opções:
    ${questionData.options.map(opt => `${opt.letter} ${opt.text}`).join('\n')}
    `;
    
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        const data = await response.json();
        const answer = data.candidates[0].content.parts[0].text.trim();
        
        const letterMatch = answer.match(/^[a-eA-E]/);
        if (letterMatch) {
            const letter = letterMatch[0].toLowerCase();
            const selectedOption = questionData.options.find(opt => opt.letter === letter);
            return `${letter} (${selectedOption ? selectedOption.text : 'Resposta não encontrada'})`;
        }
        
        return answer;
    } catch (error) {
        return '❌ Erro ao consultar a API';
    }
}

function selectAnswer(questionId, answerLetter) {
    const questionDiv = document.getElementById(questionId);
    if (!questionDiv) return false;
    
    const radioInput = questionDiv.querySelector(`input[value="${answerLetter}"]`);
    if (radioInput) {
        radioInput.checked = true;
        
        const saveButton = questionDiv.querySelector('input[type="button"][value="Salvar resposta"]');
        if (saveButton) {
            saveButton.click();
            return true;
        }
    }
    
    return false;
}

async function processQuestions() {
    createMenu();
    
    addMessageToMenu('🔍 Procurando perguntas...');
    const questions = extractQuestions();
    
    if (questions.length === 0) {
        addMessageToMenu('❌ Nenhuma pergunta encontrada');
        return;
    }
    
    addMessageToMenu(`✅ ${questions.length} pergunta(s) encontrada(s)`);
    
    for (const question of questions) {
        addMessageToMenu(`❓ Pergunta ${question.number}: ${question.question}`);
        
        const answer = await getGeminiAnswer(question);
        //addMessageToMenu(`🎯 Resposta: ${answer}`, 'answer');
        
        const letterMatch = answer.match(/^[a-e]/);
        if (letterMatch) {
            const answerLetter = getAnswerIndex(letterMatch[0]);
            const selected = selectAnswer(question.questionId, answerLetter);
            
            if (selected) {
                addMessageToMenu('✅ Resposta selecionada automaticamente');
            } else {
                addMessageToMenu('⚠️ Não foi possível selecionar a resposta automaticamente');
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    addMessageToMenu('✨ Todas as perguntas processadas');
}

function getAnswerIndex(letter) {
    const letterMap = {a: 0, b: 1, c: 2, d: 3, e: 4};
    return letterMap[letter.toLowerCase()] || 0;
}

processQuestions();
