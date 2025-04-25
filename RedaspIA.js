console.clear();
const noop = () => {};
console.warn = console.error = window.debug = noop;

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
      console.error("[ERROR]", erro);
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
      console.error("[ERROR]", erro);
    }
    
    await new Promise(resolve => setTimeout(async () => {
      if (campoTexto.value !== textoParaInserir) {
        try {
          campoTexto.focus();
          campoTexto.select();
          document.execCommand("delete", false);
          document.execCommand("insertText", false, textoParaInserir);
        } catch (erro) {
        }
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
        } catch (erro) {
        }
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
    estiloNotificacao.textContent = `
      .notificacao-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 350px;
      }
      
      .notificacao {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(120%);
        opacity: 0;
        transition: transform 0.4s ease, opacity 0.3s ease;
        overflow: hidden;
        position: relative;
      }
      
      .notificacao.mostrar {
        transform: translateX(0);
        opacity: 1;
      }
      
      .notificacao-icone {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      
      .notificacao-conteudo {
        flex-grow: 1;
      }
      
      .notificacao-titulo {
        font-weight: 600;
        font-size: 16px;
        margin: 0 0 4px 0;
      }
      
      .notificacao-mensagem {
        font-size: 14px;
        margin: 0;
        color: #666;
      }
      
      .notificacao-fechar {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        color: #999;
        padding: 0;
        transition: color 0.2s;
      }
      
      .notificacao-fechar:hover {
        color: #555;
      }
      
      .notificacao-progresso {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        width: 100%;
        transform-origin: left center;
      }
      
      .notificacao-sucesso .notificacao-icone {
        background-color: #edf7ed;
        color: #4caf50;
      }
      
      .notificacao-sucesso .notificacao-progresso {
        background-color: #4caf50;
      }
      
      .notificacao-info .notificacao-icone {
        background-color: #e9f5fe;
        color: #2196f3;
      }
      
      .notificacao-info .notificacao-progresso {
        background-color: #2196f3;
      }
      
      .notificacao-aviso .notificacao-icone {
        background-color: #fff8e6;
        color: #ff9800;
      }
      
      .notificacao-aviso .notificacao-progresso {
        background-color: #ff9800;
      }
      
      .notificacao-erro .notificacao-icone {
        background-color: #feebeb;
        color: #f44336;
      }
      
      .notificacao-erro .notificacao-progresso {
        background-color: #f44336;
      }
      
      @keyframes progresso {
        0% { transform: scaleX(1); }
        100% { transform: scaleX(0); }
      }
      
      .pulse {
        animation: pulse 1s ease-in-out;
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `;
    
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
  
  // Sistema de notificações baseado em promises para garantir sincronização
  function mostrarNotificacaoSinc(tipo, titulo, mensagem, duracao = 3000) {
    return new Promise(resolve => {
      inicializarNotificacoes();
      
      // Remover notificações anteriores do mesmo tipo (opcional)
      const notificacoesAnteriores = document.querySelectorAll(`.notificacao-${tipo}`);
      notificacoesAnteriores.forEach(notif => {
        if (notif && notif.parentElement) {
          notif.parentElement.removeChild(notif);
        }
      });
      
      const container = document.querySelector('.notificacao-container');
      const notificacao = document.createElement('div');
      notificacao.className = `notificacao notificacao-${tipo}`;
      
      // Configurar ícones baseados no tipo
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
      
      // Construir HTML da notificação
      notificacao.innerHTML = `
        <div class="notificacao-icone">${icone}</div>
        <div class="notificacao-conteudo">
          <h4 class="notificacao-titulo">${titulo}</h4>
          <p class="notificacao-mensagem">${mensagem}</p>
        </div>
        <button class="notificacao-fechar">×</button>
        <div class="notificacao-progresso"></div>
      `;
      
      // Adicionar ao container
      container.appendChild(notificacao);
      
      // Animar entrada
      setTimeout(() => {
        notificacao.classList.add('mostrar');
        const progressoEl = notificacao.querySelector('.notificacao-progresso');
        progressoEl.style.animation = `progresso ${duracao/1000}s linear`;
      }, 10);
      
      // Configurar botão de fechar
      const botaoFechar = notificacao.querySelector('.notificacao-fechar');
      botaoFechar.addEventListener('click', () => {
        fecharNotificacao(notificacao);
        resolve();
      });
      
      // Auto-fechar após duração
      const timeoutId = setTimeout(() => {
        fecharNotificacao(notificacao);
        resolve();
      }, duracao);
      
      // Adicionar animação de pulse ao ícone
      const iconeEl = notificacao.querySelector('.notificacao-icone');
      iconeEl.classList.add('pulse');
      
      // Armazenar timeoutId para poder cancelar se o usuário fechar manualmente
      notificacao.dataset.timeoutId = timeoutId;
    });
  }
  
  function fecharNotificacao(notificacao) {
    // Cancelar timeout se existir
    if (notificacao.dataset.timeoutId) {
      clearTimeout(parseInt(notificacao.dataset.timeoutId));
    }
    
    // Animar saída
    notificacao.style.opacity = '0';
    notificacao.style.transform = 'translateX(120%)';
    
    // Remover do DOM após animação
    setTimeout(() => {
      if (notificacao.parentElement) {
        notificacao.parentElement.removeChild(notificacao);
      }
    }, 300);
  }
  
  async function obterRespostaIA(promptTexto) {
    try {
      const resposta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDtanrJtBBHgkmelHFhAowEXAyjLyM4Y1c`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: promptTexto }]
          }],
          generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192
          }
        })
      });
      
      if (!resposta.ok) {
        await mostrarNotificacaoSinc('erro', 'Erro', `Falha na API do Gemini: ${resposta.status}`, 5000);
        throw new Error("Erro na API do Gemini: " + resposta.status);
      }
      
      const dadosResposta = await resposta.json();
      
      if (!dadosResposta.candidates?.[0]?.content?.parts) {
        await mostrarNotificacaoSinc('erro', 'Erro', 'Resposta inválida da API do Gemini', 5000);
        throw new Error("Resposta inválida da API do Gemini");
      }
      
      await mostrarNotificacaoSinc('sucesso', 'Sucesso', 'Redação gerada com sucesso!', 5000);
      return dadosResposta.candidates[0].content.parts[0].text;
    } catch (erro) {
      console.error("[ERROR] Falha ao obter resposta da IA:", erro);
      await mostrarNotificacaoSinc('erro', 'Erro', `Falha ao obter resposta da IA: ${erro.message}`, 5000);
      throw erro;
    }
  }
  
  async function verificarRedacao() {
    const elementoRedacao = document.querySelector("p.MuiTypography-root.MuiTypography-body1.css-m576f2");
    
    if (elementoRedacao && elementoRedacao.textContent.includes("Redação")) {
      try {
        await mostrarNotificacaoSinc('info', 'Script Iniciado!', 'Bem-Vindo ao melhor script para Redação Paulista', 5000);
        
        const coletaneaHTML = document.querySelector(".ql-editor").innerHTML;
        const enunciado = document.querySelector(".ql-align-justify").innerText;
        const generoTextual = document.querySelector(".css-1cq7p20").innerText;
        const criteriosAvaliacao = document.querySelector(".css-1pvvm3t").innerText;
        
        const dadosRedacao = {
          coletanea: coletaneaHTML,
          enunciado: enunciado,
          generoTextual: generoTextual,
          criteriosAvaliacao: criteriosAvaliacao
        };
        
        const promptGeracaoRedacao = `
                Usando as informações a seguir sobre uma tarefa de redação, você precisa me fornecer:
                1. Um título para a redação
                2. O texto completo da redação
                
                **Formate sua resposta exatamente assim:**
                TITULO: [Título da redação]
                
                TEXTO: [Texto da redação]
                
                Informações da redação: ${JSON.stringify(dadosRedacao)}`;
        
        await mostrarNotificacaoSinc('aviso', 'Gerando Redação', 'O processo de geração foi iniciado. Pode levar alguns segundos...', 5000);
        
        const respostaRedacao = await obterRespostaIA(promptGeracaoRedacao);
        
        if (!respostaRedacao.includes("TITULO:") || !respostaRedacao.includes("TEXTO:")) {
          await mostrarNotificacaoSinc('erro', 'Erro de Formato', 'A resposta da IA não contém o formato esperado (TITULO/TEXTO)', 5000);
          throw new Error("Formato de resposta da IA inválido. A resposta não contém 'TITULO:' ou 'TEXTO:'.");
        }
        
        const tituloRedacao = respostaRedacao.split("TITULO:")[1].split("TEXTO:")[0].trim();
        const textoRedacao = respostaRedacao.split("TEXTO:")[1].trim();
        
        await mostrarNotificacaoSinc('info', 'Humanizando', 'Tornando o texto mais natural...', 5000);
        
        const promptHumanizacao = `
                Reescreva o seguinte texto acadêmico em português para que pareça escrito por um estudante humano, não por IA.
                
                Regras importantes:
                1. Mantenha o conteúdo e os argumentos principais intactos
                2. Adicione pequenas imperfeições naturais como ocasionais repetições de palavras ou construções frasais variadas
                3. Use linguagem mais natural e menos robótica, com algumas expressões coloquiais
                4. Varie o comprimento das frases para criar um ritmo mais natural
                5. Preserve os parágrafos e a estrutura geral
                6. Mantenha todas as referências e exemplos usados, apenas reescrevendo-os de forma mais natural
                7. Ocasionalmente adicione palavras como "tipo", "bem", "na real" para dar um tom mais humano
                8. Evite linguagem artificial ou muito técnica que um estudante normalmente não usaria
                
                Texto para reescrever:
                ${textoRedacao}
                
                Lembre-se: devolva APENAS o texto reescrito, sem comentários ou explicações adicionais.
            `;
        
        const textoHumanizado = await obterRespostaIA(promptHumanizacao, 'Humanizando o texto da redação...');
        
        const campoTitulo = document.querySelector("textarea").parentElement;
        await manipularTextareaMUI(campoTitulo, tituloRedacao);
        
        const todosCamposTexto = document.querySelectorAll("textarea");
        const campoConteudo = todosCamposTexto[todosCamposTexto.length - 1].parentElement;
        await manipularTextareaMUI(campoConteudo, textoHumanizado);
        
        await mostrarNotificacaoSinc('sucesso', 'Tudo Pronto! 🎉', 'Redação inserida com sucesso! Tudo pronto para enviar!', 5000);
        
      } catch (erro) {
        await mostrarNotificacaoSinc('erro', 'Erro Fatal', `Ocorreu um erro: ${erro.message}`, 5000);
        console.error('[ERROR]', erro);
      }
    } else {
      await mostrarNotificacaoSinc('erro', 'Página Inválida', 'Você precisa usar o script em uma página de redação. ⚠️', 5000);
    }
  }
  
  verificarRedacao();
  console.clear();
