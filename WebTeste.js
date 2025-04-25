function mostrarPopup() {
  const popupAnterior = document.getElementById('popup-personalizado');
  const overlayAnterior = document.getElementById('overlay-personalizado');
  if (popupAnterior) document.body.removeChild(popupAnterior);
  if (overlayAnterior) document.body.removeChild(overlayAnterior);

  if (!document.getElementById('google-fonts')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'google-fonts';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap';
    document.head.appendChild(fontLink);
  }
  
  const overlay = document.createElement('div');
  overlay.id = 'overlay-personalizado';
  overlay.style.position = 'fixed';
  overlay.style.left = '0';
  overlay.style.top = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  overlay.style.zIndex = '9998';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.3s ease';
  
  const popup = document.createElement('div');
  popup.id = 'popup-personalizado';
  
  popup.style.position = 'fixed';
  popup.style.left = '50%';
  popup.style.top = '50%';
  popup.style.transform = 'translate(-50%, -50%) scale(0.8)';
  popup.style.backgroundColor = '#222';
  popup.style.color = '#fff';
  popup.style.padding = '20px';
  popup.style.borderRadius = '10px';
  popup.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
  popup.style.zIndex = '9999';
  popup.style.fontFamily = "'Poppins', sans-serif";
  popup.style.textAlign = 'center';
  popup.style.width = '90%';
  popup.style.maxWidth = '350px';
  popup.style.opacity = '0';
  popup.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  popup.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  
  const titulo = document.createElement('h2');
  titulo.innerHTML = '<strong>Script iniciado com sucesso!</strong>';
  titulo.style.margin = '20px 0 10px 0';
  titulo.style.fontSize = '20px';
  titulo.style.fontWeight = '600';
  titulo.style.color = '#4ecb71';
  popup.appendChild(titulo);
  
  const subtitulo = document.createElement('p');
  subtitulo.textContent = 'O sistema está pronto para uso.';
  subtitulo.style.margin = '0 0 20px 0';
  subtitulo.style.fontSize = '14px';
  subtitulo.style.opacity = '0.7';
  popup.appendChild(subtitulo);
  
  const botaoFechar = document.createElement('button');
  botaoFechar.textContent = 'Fechar';
  botaoFechar.style.backgroundColor = '#4e9cff';
  botaoFechar.style.color = 'white';
  botaoFechar.style.border = 'none';
  botaoFechar.style.borderRadius = '5px';
  botaoFechar.style.padding = '10px 20px';
  botaoFechar.style.fontSize = '14px';
  botaoFechar.style.cursor = 'pointer';
  botaoFechar.style.fontFamily = "'Poppins', sans-serif";
  botaoFechar.style.fontWeight = '500';
  botaoFechar.style.transition = 'all 0.2s ease';
  botaoFechar.style.outline = 'none';
  botaoFechar.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
  botaoFechar.style.width = 'auto';
  botaoFechar.style.display = 'inline-block';
  
  botaoFechar.addEventListener('mouseover', function() {
    this.style.backgroundColor = '#3a8ae6';
    this.style.transform = 'translateY(-2px)';
  });
  
  botaoFechar.addEventListener('mouseout', function() {
    this.style.backgroundColor = '#4e9cff';
    this.style.transform = 'translateY(0)';
  });
  
  botaoFechar.addEventListener('click', function() {
    popup.style.transform = 'translate(-50%, -50%) scale(0.8)';
    popup.style.opacity = '0';
    overlay.style.opacity = '0';
    
    setTimeout(function() {
      if (document.body.contains(popup)) document.body.removeChild(popup);
      if (document.body.contains(overlay)) document.body.removeChild(overlay);
    }, 300);
  });
  
  popup.appendChild(botaoFechar);
  document.body.appendChild(overlay);
  document.body.appendChild(popup);
  
  if (!document.getElementById('popup-styles')) {
    const style = document.createElement('style');
    style.id = 'popup-styles';
    style.textContent = `
      @media (max-width: 480px) {
        #popup-personalizado {
          padding: 15px;
        }
        #popup-personalizado h2 {
          font-size: 16px;
        }
        #popup-personalizado p {
          font-size: 12px;
        }
        #popup-personalizado button {
          padding: 8px 16px;
          font-size: 13px;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  setTimeout(function() {
    overlay.style.opacity = '1';
    popup.style.opacity = '1';
    popup.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 10);
}

mostrarPopup();
