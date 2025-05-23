// Script desenvolvido por marcos10pc ( EssayMaker )
// Eu apenas roubei ( ÓBVIO ), modifiquei, aprimorei
// e também deixei mais bonito KKKK

const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/DarkModde/Dark-Scripts/ProtectionScript.js';
document.head.appendChild(script);

console.clear();
const noop = () => {};
console.warn = console.error = window.debug = noop;

const promptsGeracao = [
    `Olá! Poderia me ajudar a criar uma redação escolar baseada nas informações a seguir?
    Por favor, inclua:
    1. Um título para a redação
    2. O texto completo da redação
    3. Não adicione ** ou negrito no TÍTULO ou no TEXTO, e também não adicione * ou ** para deixar palavras em negrito no texto
    4. Não adicione nenhum emoji nem símbolos no texto
    5. Não use simbolos no texto! como "–" ou "—" ou qualquer outro e tambem não use 3 pontinhos "..."

    Por favor, formate suas respostas assim:
    TITULO: [Título da redação]  
    TEXTO: [Texto da redação]

    Aqui estão as informações para a redação:
    {dadosRedacao}
    
    Lembre-se: devolva APENAS o texto reescrito, sem quaisquer comentários ou explicações adicionais.`,

    `Oi, você consegue gerar uma redação escolar a partir das seguintes informações?
    1. Um título criativo para a redação
    2. O conteúdo completo da redação
    3. Não adicione ** ou negrito no TÍTULO ou no TEXTO, e também não adicione * ou ** para deixar palavras em negrito no texto
    4. Não adicione nenhum emoji nem símbolos no texto
    5. Não use simbolos no texto! como "–" ou "—" ou qualquer outro e tambem não use 3 pontinhos "..."

    Responda com a seguinte formatação:
    TITULO: [Título da redação]  
    TEXTO: [Texto da redação]

    Abaixo estão as informações necessárias:
    {dadosRedacao}
    
    Lembre-se: devolva APENAS o texto reescrito, sem quaisquer comentários ou explicações adicionais.`,

    `Olá, preciso que você me forneça uma redação escolar com base nas informações a seguir.
    1. Sugerir um título para a redação
    2. Criar o texto completo da redação
    3. Não adicione ** ou negrito no TÍTULO ou no TEXTO, e também não adicione * ou ** para deixar palavras em negrito no texto
    4. Não adicione nenhum emoji nem símbolos no texto
    5. Não use simbolos no texto! como "–" ou "—" ou qualquer outro e tambem não use 3 pontinhos "..."

    Responda usando esta estrutura:
    TITULO: [Título da redação]  
    TEXTO: [Texto da redação]

    Aqui estão as informações para você usar na redação:
    {dadosRedacao}
    
    Lembre-se: devolva APENAS o texto reescrito, sem quaisquer comentários ou explicações adicionais.`,

    `Oi! Gostaria que você escrevesse uma redação escolar com base nas informações a seguir.
    1. Propor um título para a redação
    2. Desenvolver o texto completo da redação
    3. Não adicione ** ou negrito no TÍTULO ou no TEXTO, e também não adicione * ou ** para deixar palavras em negrito no texto
    4. Não adicione nenhum emoji nem símbolos no texto
    5. Não use simbolos no texto! como "–" ou "—" ou qualquer outro e tambem não use 3 pontinhos "..."

    Por favor, use esta estrutura para sua resposta:
    TITULO: [Título da redação]  
    TEXTO: [Texto da redação]

    As informações da redação são as seguintes:
    {dadosRedacao}
    
    Lembre-se: devolva APENAS o texto reescrito, sem quaisquer comentários ou explicações adicionais.`,

    `Olá! Poderia elaborar uma redação escolar com as seguintes diretrizes?
    1. Criar um título para a redação
    2. Escrever o conteúdo completo da redação
    3. Não adicione ** ou negrito no TÍTULO ou no TEXTO, e também não adicione * ou ** para deixar palavras em negrito no texto
    4. Não adicione nenhum emoji nem símbolos no texto
    5. Não use simbolos no texto! como "–" ou "—" ou qualquer outro e tambem não use 3 pontinhos "..."

    Responda com o formato abaixo:
    TITULO: [Título da redação]  
    TEXTO: [Texto da redação]

    A redação deve se basear nas seguintes informações:
    {dadosRedacao}
    
    Lembre-se: devolva APENAS o texto reescrito, sem quaisquer comentários ou explicações adicionais.`
];

const promptsHumanizacao = [
    `Olá! Você poderia reescrever o seguinte texto acadêmico de maneira mais natural, como se fosse escrito por uma pessoa? Quero que o texto tenha uma sensação mais humana e fluida.

    Aqui estão algumas regras importantes para seguir:

    1. Mantenha o conteúdo e os argumentos principais intactos;
    2. Adicione algumas imperfeições naturais e pequenas falhas para torná-lo mais real;
    3. Use uma linguagem mais acessível, evitando um tom robótico;
    4. Preserve a estrutura do texto e os parágrafos;
    5. Reescreva as referências e exemplos, mas de uma forma mais simples e natural;
    6. Evite o uso excessivo de jargões ou termos técnicos difíceis;
    7. Varie o ritmo das frases para dar mais vida ao texto, evitando uma estrutura previsível;
    8. Use expressões típicas da linguagem humana, como "por outro lado", "além disso" e "no entanto";
    9. Não se preocupe com uma gramática perfeita – adicione algumas pausas ou repetições sutis;
    10. Use um vocabulário simples, de fácil compreensão, como o de um estudante;
    11. Mantenha o tom emocional e a personalidade do texto consistente ao longo do texto;
    12. Evite listas muito formais ou estruturadas – prefira um estilo mais fluido.
    13. Não use simbolos no texto! como "–" ou "—" ou qualquer outro e tambem não use 3 pontinhos "..."

    Texto a ser reescrito:
    {textoRedacao}
    
    Lembre-se: devolva APENAS o texto reescrito, sem quaisquer comentários ou explicações adicionais.`,

    `Oi! Você poderia dar uma cara mais humana para o seguinte texto acadêmico? O objetivo é que ele pareça escrito por uma pessoa e não por uma máquina. Quero que a escrita soe mais natural.

    Aqui estão as orientações que você deve seguir:

    1. Mantenha os principais argumentos e a ideia geral do texto;
    2. Adicione alguns erros leves ou imperfeições para deixar o texto mais realista;
    3. Use uma linguagem mais comum, sem parecer robótico;
    4. Preserve a estrutura e os parágrafos do texto original;
    5. Reescreva as referências e exemplos, mas de forma mais simples e fluída;
    6. Evite usar palavras muito técnicas ou difíceis de entender;
    7. Varie o ritmo das frases e crie uma narrativa menos repetitiva;
    8. Inclua palavras e expressões típicas de uma conversa, como "além disso" e "no entanto";
    9. Permita pequenas falhas na gramática e pontuação, como se fosse uma escrita mais espontânea;
    10. Adapte o vocabulário para algo mais acessível, como se fosse de um estudante comum;
    11. Mantenha o tom emocional e a consistência ao longo de todo o texto;
    12. Evite listas excessivas ou muito mecânicas, buscando um estilo narrativo.
    13. Não use simbolos no texto! como "–" ou "—" ou qualquer outro e tambem não use 3 pontinhos "..."

    Texto para reescrever:
    {textoRedacao}
    
    Lembre-se: devolva APENAS o texto reescrito, sem quaisquer comentários ou explicações adicionais.`,

    `Olá, você poderia reescrever o texto acadêmico abaixo de maneira mais fluída e com um tom mais humano? Gostaria que o texto tivesse um ritmo natural e fosse mais fácil de ler, como se fosse escrito por uma pessoa de verdade.

    Regras a seguir:

    1. Não mude os principais argumentos e conteúdo do texto;
    2. Adicione algumas imperfeições para dar um toque mais humano e natural;
    3. Use uma linguagem mais leve, evitando parecer algo automático ou técnico;
    4. Mantenha a estrutura e os parágrafos do texto original;
    5. Reescreva as referências e exemplos, mas de forma mais acessível e fluida;
    6. Evite palavras complicadas ou excessivamente técnicas;
    7. Faça variações no ritmo das frases, para tornar o texto mais interessante;
    8. Utilize expressões comuns como "por outro lado" ou "no entanto" para dar fluidez;
    9. Não se preocupe em ter uma pontuação ou gramática perfeitas, pequenas pausas são bem-vindas;
    10. Adapte o vocabulário para algo mais simples, como um estudante faria;
    11. Garanta que o tom e a emoção do texto permaneçam consistentes;
    12. Evite listas rígidas ou estruturadas demais, favorecendo um estilo mais fluido.
    13. Não use simbolos no texto! como "–" ou "—" ou qualquer outro e tambem não use 3 pontinhos "..."

    Texto para reescrever:
    {textoRedacao}
    
    Lembre-se: devolva APENAS o texto reescrito, sem quaisquer comentários ou explicações adicionais.`,

    `Oi! Você consegue reescrever o seguinte texto acadêmico para que pareça mais natural e escrito por uma pessoa? Eu gostaria que o texto ficasse mais leve e com uma cara menos de máquina e mais de ser humano.

    Aqui estão algumas orientações para a reescrita:

    1. Mantenha os principais pontos e ideias do texto;
    2. Deixe o texto um pouco mais "imperfeito", com pequenas falhas que tornem a escrita mais realista;
    3. Use uma linguagem mais simples e natural, fugindo de um tom robótico;
    4. Preserve a estrutura geral e os parágrafos do texto original;
    5. Reescreva as referências e exemplos de forma mais simples e fluída;
    6. Evite termos técnicos ou difíceis de entender, optando por algo mais acessível;
    7. Varie o ritmo das frases e altere a estrutura para criar mais dinamismo;
    8. Inclua expressões comuns, como "no entanto" ou "além disso", para deixar o texto mais natural;
    9. Não se preocupe com uma gramática excessivamente rígida – pequenas falhas são aceitáveis;
    10. Use um vocabulário simples, com o nível de um estudante comum;
    11. Mantenha o tom e a consistência emocional durante o texto inteiro;
    12. Evite usar listas ou estruturas muito mecânicas – busque um estilo mais fluido.
    13. Não use simbolos no texto! como "–" ou "—" ou qualquer outro e tambem não use 3 pontinhos "..."

    Texto para reescrever:
    {textoRedacao}
    
    Lembre-se: devolva APENAS o texto reescrito, sem quaisquer comentários ou explicações adicionais.`,

    `Olá! Você poderia reescrever o seguinte texto acadêmico de forma que ele pareça mais humano e natural? Gostaria que o texto fosse mais fluído e com uma linguagem mais próxima do jeito que uma pessoa escreveria.

    Seguem as diretrizes para a reescrita:

    1. Mantenha o conteúdo e os principais argumentos intactos;
    2. Adicione imperfeições naturais, para que o texto não soe robótico;
    3. Use uma linguagem mais acessível e fluída, sem ser excessivamente técnica;
    4. Preserve a estrutura e os parágrafos do texto original;
    5. Reescreva as referências e exemplos de maneira mais simples, mantendo o significado;
    6. Evite o uso de palavras ou termos técnicos que possam tornar o texto difícil;
    7. Varie o ritmo das frases e crie uma narrativa mais dinâmica e interessante;
    8. Use expressões típicas de uma conversa cotidiana, como "por outro lado" ou "além disso";
    9. Permita pequenas falhas ou variações na pontuação, para dar um toque mais natural;
    10. Adapte o vocabulário para algo que um estudante comum usaria;
    11. Garanta que o tom e a emoção do texto se mantenham consistentes ao longo de toda a escrita;
    12. Evite a rigidez das listas e prefira um estilo mais fluído e narrativo.
    13. Não use simbolos no texto! como "–" ou "—" ou qualquer outro e tambem não use 3 pontinhos "..."

    Texto para reescrever:
    {textoRedacao}
    
    Lembre-se: devolva APENAS o texto reescrito, sem quaisquer comentários ou explicações adicionais.`
];

async function manipularTextareaMUI(elementoPai, textoParaInserir) {
    const campoTexto = elementoPai.querySelector("textarea:not([aria-hidden=\"true\"])");
    if (!campoTexto) return false;
    
    try {
      const propriedadesReact = Object.keys(campoTexto).filter(chave => 
        chave.startsWith("__reactProps$") || 
        chave.startsWith("__reactEventHandlers$") || 
        chave.startsWith("__reactFiber$")
      );
      
      if (propriedadesReact.length > 0) {
        for (const propriedade of propriedadesReact) {
          const handler = campoTexto[propriedade];
          if (handler && typeof handler.onChange === "function") {
            const eventoSimulado = {
              target: { value: textoParaInserir },
              currentTarget: { value: textoParaInserir },
              preventDefault: () => {},
              stopPropagation: () => {}
            };
            handler.onChange(eventoSimulado);
            await new Promise(resolve => setTimeout(resolve, 100));
            return true;
          }
        }
      }
    } catch (erro) {
      return false;
    }
    
    try {
      campoTexto.value = "";
      campoTexto.dispatchEvent(new Event("input", { bubbles: true }));
      
      await new Promise(resolve => setTimeout(() => {
        campoTexto.value = textoParaInserir;
        campoTexto.dispatchEvent(new Event("input", { bubbles: true }));
        campoTexto.dispatchEvent(new Event("change", { bubbles: true }));
        campoTexto.dispatchEvent(new Event("blur", { bubbles: true }));
        resolve();
      }, 50));
    } catch (erro) {
      return false;
    }
    
    await new Promise(resolve => setTimeout(async () => {
      if (campoTexto.value !== textoParaInserir) {
        try {
          campoTexto.focus();
          campoTexto.select();
          document.execCommand("delete", false);
          document.execCommand("insertText", false, textoParaInserir);
        } catch (erro) {}
      }
      resolve();
    }, 150));
    
    await new Promise(resolve => setTimeout(async () => {
      if (campoTexto.value !== textoParaInserir) {
        try {
          campoTexto.focus();
          campoTexto.value = "";
          const eventoInput = new InputEvent("input", {
            bubbles: true,
            data: textoParaInserir,
            inputType: "insertText"
          });
          campoTexto.value = textoParaInserir;
          campoTexto.dispatchEvent(eventoInput);
        } catch (erro) {}
      }
      resolve();
    }, 250));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
}

function criarEstiloNotificacao() {
    if (document.getElementById('estilo-notificacao')) return;
    
    const estiloNotificacao = document.createElement('style');
    estiloNotificacao.id = 'estilo-notificacao';
    estiloNotificacao.textContent = `.notificacao-container{position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;max-width:350px}.notificacao{background-color:#fff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.15);padding:16px;display:flex;align-items:center;gap:12px;transform:translateX(120%);opacity:0;transition:transform .4s ease,opacity .3s ease;overflow:hidden;position:relative}.notificacao.mostrar{transform:translateX(0);opacity:1}.notificacao-icone{flex-shrink:0;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%}.notificacao-conteudo{flex-grow:1}.notificacao-titulo{font-weight:600;font-size:16px;margin:0 0 4px 0}.notificacao-mensagem{font-size:14px;margin:0;color:#666}.notificacao-fechar{background:0;border:0;cursor:pointer;font-size:18px;color:#999;padding:0;transition:color .2s}.notificacao-fechar:hover{color:#555}.notificacao-progresso{position:absolute;bottom:0;left:0;height:3px;width:100%;transform-origin:left center}.notificacao-sucesso .notificacao-icone{background-color:#edf7ed;color:#4caf50}.notificacao-sucesso .notificacao-progresso{background-color:#4caf50}.notificacao-info .notificacao-icone{background-color:#e9f5fe;color:#2196f3}.notificacao-info .notificacao-progresso{background-color:#2196f3}.notificacao-aviso .notificacao-icone{background-color:#fff8e6;color:#ff9800}.notificacao-aviso .notificacao-progresso{background-color:#ff9800}.notificacao-erro .notificacao-icone{background-color:#feebeb;color:#f44336}.notificacao-erro .notificacao-progresso{background-color:#f44336}@keyframes progresso{0%{transform:scaleX(1)}100%{transform:scaleX(0)}}.pulse{animation:pulse 1s ease-in-out}@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(1)}}`;
    document.head.appendChild(estiloNotificacao);
}

function inicializarNotificacoes() {
    criarEstiloNotificacao();
    if (!document.querySelector('.notificacao-container')) {
      const container = document.createElement('div');
      container.className = 'notificacao-container';
      document.body.appendChild(container);
    }
}

function mostrarNotificacaoSinc(tipo, titulo, mensagem, duracao = 3000) {
    return new Promise(resolve => {
      inicializarNotificacoes();
      const notificacoesAnteriores = document.querySelectorAll(`.notificacao-${tipo}`);
      notificacoesAnteriores.forEach(notif => {
        if (notif && notif.parentElement) notif.parentElement.removeChild(notif);
      });
      
      const container = document.querySelector('.notificacao-container');
      const notificacao = document.createElement('div');
      notificacao.className = `notificacao notificacao-${tipo}`;
      
      let icone = '';
      switch (tipo) {
        case 'sucesso':
          icone = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
          break;
        case 'info':
          icone = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line></svg>';
          break;
        case 'aviso':
          icone = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12" y2="17"></line></svg>';
          break;
        case 'erro':
          icone = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
          break;
      }
      
      notificacao.innerHTML = `<div class="notificacao-icone">${icone}</div><div class="notificacao-conteudo"><h4 class="notificacao-titulo">${titulo}</h4><p class="notificacao-mensagem">${mensagem}</p></div><button class="notificacao-fechar">×</button><div class="notificacao-progresso"></div>`;
      container.appendChild(notificacao);
      
      setTimeout(() => {
        notificacao.classList.add('mostrar');
        const progressoEl = notificacao.querySelector('.notificacao-progresso');
        progressoEl.style.animation = `progresso ${duracao/1000}s linear`;
      }, 10);
      
      const botaoFechar = notificacao.querySelector('.notificacao-fechar');
      botaoFechar.addEventListener('click', () => {
        fecharNotificacao(notificacao);
        resolve();
      });
      
      const timeoutId = setTimeout(() => {
        fecharNotificacao(notificacao);
        resolve();
      }, duracao);
      
      const iconeEl = notificacao.querySelector('.notificacao-icone');
      iconeEl.classList.add('pulse');
      notificacao.dataset.timeoutId = timeoutId;
    });
}

function fecharNotificacao(notificacao) {
    if (notificacao.dataset.timeoutId) clearTimeout(parseInt(notificacao.dataset.timeoutId));
    notificacao.style.opacity = '0';
    notificacao.style.transform = 'translateX(120%)';
    setTimeout(() => {
      if (notificacao.parentElement) notificacao.parentElement.removeChild(notificacao);
    }, 300);
}

async function obterRespostaIA(promptTexto) {
    try {
        const resposta = await fetch("https://corsproxy.io/?url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDDauPWG3xlm6QXkGvt0ZmFS9jcNnpS0ps", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: promptTexto
                            }
                        ]
                    }
                ]
            })
        });

        const dadosResposta = await resposta.json();
        return dadosResposta?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (erro) {
        return '';
    }
}

async function verificarRedacao() {
    const elementoRedacao = document.querySelector("p.MuiTypography-root.MuiTypography-body1.css-m576f2");
    
    if (elementoRedacao && elementoRedacao.textContent.includes("Redação")) {
      try {
        await mostrarNotificacaoSinc('info', 'Script Iniciado!', 'Bem-Vindo ao melhor script para Redação Paulista', 5000);
        
        const coletaneaHTML = document.querySelector(".ql-editor").innerHTML;
        const enunciado = document.querySelector(".ql-align-justify").innerText;
        const generoTextual = document.querySelector(".css-1pvvm3t").innerText;
        const criteriosAvaliacao = document.querySelector(".css-1pvvm3t").innerText;
        
        const dadosRedacao = {
          coletanea: coletaneaHTML,
          enunciado: enunciado,
          generoTextual: generoTextual,
          criteriosAvaliacao: criteriosAvaliacao
        };
        
        const promptGeracaoAleatorio = promptsGeracao[Math.floor(Math.random() * promptsGeracao.length)]
            .replace('{dadosRedacao}', JSON.stringify(dadosRedacao));
        
        await mostrarNotificacaoSinc('aviso', 'Gerando Redação', 'O processo de geração foi iniciado. Pode levar alguns segundos...', 5000);
        
        const respostaRedacao = await obterRespostaIA(promptGeracaoAleatorio);
        
        if (!respostaRedacao.includes("TITULO:") || !respostaRedacao.includes("TEXTO:")) {
          return;
        }
        
        const tituloRedacao = respostaRedacao.split("TITULO:")[1].split("TEXTO:")[0].trim();
        const textoRedacao = respostaRedacao.split("TEXTO:")[1].trim();
        
        await mostrarNotificacaoSinc('info', 'Humanizando', 'Tornando o texto mais natural...', 5000);
        
        const promptHumanizacaoAleatorio = promptsHumanizacao[Math.floor(Math.random() * promptsHumanizacao.length)]
            .replace('{textoRedacao}', textoRedacao);
        
        const textoHumanizado = await obterRespostaIA(promptHumanizacaoAleatorio);
        
        const campoTitulo = document.querySelector("textarea").parentElement;
        await manipularTextareaMUI(campoTitulo, tituloRedacao);
        
        const todosCamposTexto = document.querySelectorAll("textarea");
        const campoConteudo = todosCamposTexto[todosCamposTexto.length - 1].parentElement;
        await manipularTextareaMUI(campoConteudo, textoHumanizado);
        
        await mostrarNotificacaoSinc('sucesso', 'Tudo Pronto! 🎉', 'Redação inserida com sucesso! Tudo pronto para enviar!', 5000);
      } catch (erro) {
        return;
      }
    }
}

verificarRedacao();
console.clear();
