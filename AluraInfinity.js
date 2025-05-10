// ==UserScript==
// @name         Alura-Infinity
// @namespace    https://cursos.alura.com.br/
// @match        https://cursos.alura.com.br/course/*/task/*
// @icon         https://i.imgur.com/OtfkTcS.png
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const urlAtual = window.location.href;
  const botaoProximo = document.getElementsByClassName("bootcamp-next-button")[0];

  if (!botaoProximo) return;

  const partesDaURL = urlAtual.split("/");

  document.getElementById("transcription")?.click();

  const listaAlternativas = document.querySelector(".alternativeList");
  if (listaAlternativas) {
    listaAlternativas.querySelectorAll("li[data-correct=\"true\"] input[type=\"checkbox\"]").forEach(cb => !cb.checked && cb.click());
  }

  document.querySelectorAll(".alternativeList-item[data-correct=\"true\"] input[type=\"radio\"]").forEach(radio => radio.click());

  document.getElementsByClassName("task-actions-button")[0]?.click();

  const formulario = document.querySelector("form[data-gtm-form-interact-id=\"0\"]");
  if (formulario) {
    formulario.querySelectorAll("li[data-correct=\"true\"] input[type=\"checkbox\"]").forEach(cb => !cb.checked && cb.click());
  }

  const blocosOrigem = document.getElementById("sortBlocksOrigin");
  if (blocosOrigem) {
    blocosOrigem.querySelectorAll(".block").forEach(bloco => bloco.click());
    document.getElementById("submitBlocks")?.click();
  }

  document.querySelector("a.task-actions-button-next")?.click();

  if (document.getElementById("project-link")) {
    const tituloTarefa = document.querySelector(".task-body-header-title small");
    let numeroSecao = tituloTarefa?.textContent.trim() || "";

    if (numeroSecao.startsWith("0")) {
      numeroSecao = numeroSecao.substring(1);
    }

    const cursoID = partesDaURL[4];
    const tarefaID = partesDaURL[partesDaURL.length - 1];

    fetch(`https://cursos.alura.com.br/course/${cursoID}/section/${numeroSecao}/linksubmit/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        taskId: Number(tarefaID),
        alternatives: [],
        linkUrl: "https://github.com/undefined/"
      })
    });
  }

  setTimeout(() => botaoProximo.click(), 5000);
})();
