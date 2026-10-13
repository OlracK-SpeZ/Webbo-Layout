const menuElementi = document.getElementById("menu-elementi");
const foglio = document.getElementById("foglio");
const pulsanteUndo = document.getElementById("pulsante-annulla");
const pulsanteElimina = document.getElementById("pulsante-elimina");
const pulsanteSvuota = document.getElementById("pulsante-svuota");
const pulsanteInserisciDopo = document.getElementById(
  "pulsante-inserisci-dopo",
);
const pulsanteSostituisci = document.getElementById("pulsante-sostituisci");
const pulsanteRandom = document.getElementById("pulsante-random");
const pulsanteDownload = document.getElementById("pulsante-download");
const pulsanteMenu = document.getElementById("pulsante-menu");
const pulsanteSu = document.getElementById("pulsante-su");
const pulsanteGiu = document.getElementById("pulsante-giu");

let elementoSelezionato = null;
let immagineAsideSelezionata = null;

const elementiInseriti = [];
const cronologia = [];

menuElementi.addEventListener("click", selezionaImmagineAside);
foglio.addEventListener("click", clicSulFoglio);
pulsanteUndo.addEventListener("click", annullaUltimaAzione);
pulsanteElimina.addEventListener("click", eliminaElementoSelezionato);
pulsanteSvuota.addEventListener("click", svuotaFoglio);
pulsanteInserisciDopo.addEventListener("click", inserisciDopoSelezionato);
pulsanteSostituisci.addEventListener("click", sostituisciSelezionato);
pulsanteRandom.addEventListener("click", disposizioneRandom);
pulsanteDownload.addEventListener("click", scaricaFoglio);
pulsanteMenu.addEventListener("click", apriChiudiMenu);
pulsanteSu.addEventListener("click", muoviElementoSu);
pulsanteGiu.addEventListener("click", muoviElementoGiu);

function apriChiudiMenu() {
  menuElementi.classList.toggle("aperto");
}

function clicSulFoglio(evento) {
  const cliccato = evento.target.closest(".elemento");

  menuElementi.classList.remove("aperto");

  if (cliccato === null) {
    deselezionaTutto();
    return;
  }

  if (cliccato === elementoSelezionato) {
    deselezionaTutto();
    return;
  }

  if (elementoSelezionato !== null) {
    elementoSelezionato.classList.remove("selezionato");
  }

  if (immagineAsideSelezionata !== null) {
    immagineAsideSelezionata.classList.remove("selezionato");
    immagineAsideSelezionata = null;
  }

  elementoSelezionato = cliccato;
  elementoSelezionato.classList.add("selezionato");
}

function selezionaImmagineAside(evento) {
  const cliccata = evento.target.closest(".elemento-menu");

  if (cliccata === null) {
    return;
  }

  if (elementoSelezionato === null) {
    inserisciElementoInFondo(cliccata);
    return;
  }

  if (immagineAsideSelezionata !== null) {
    immagineAsideSelezionata.classList.remove("selezionato");
  }

  immagineAsideSelezionata = cliccata;
  immagineAsideSelezionata.classList.add("selezionato");
}

function creaElemento(immagine) {
  const nuovoElemento = document.createElement("img");

  nuovoElemento.src = immagine.src;
  nuovoElemento.alt = immagine.alt;
  nuovoElemento.classList.add("elemento");

  return nuovoElemento;
}

function inserisciElementoInFondo(immagine) {
  const nuovoElemento = creaElemento(immagine);

  foglio.appendChild(nuovoElemento);
  elementiInseriti.push(nuovoElemento);

  cronologia.push({
    tipo: "inserimento",
    elemento: nuovoElemento,
  });

  nuovoElemento.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });
}

function inserisciDopoSelezionato() {
  if (elementoSelezionato === null || immagineAsideSelezionata === null) {
    return;
  }

  const nuovoElemento = creaElemento(immagineAsideSelezionata);
  const posizione = elementiInseriti.indexOf(elementoSelezionato);

  elementoSelezionato.after(nuovoElemento);

  if (posizione !== -1) {
    elementiInseriti.splice(posizione + 1, 0, nuovoElemento);
  } else {
    elementiInseriti.push(nuovoElemento);
  }

  cronologia.push({
    tipo: "inserimento",
    elemento: nuovoElemento,
  });

  nuovoElemento.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });

  deselezionaTutto();
}

function sostituisciSelezionato() {
  if (elementoSelezionato === null || immagineAsideSelezionata === null) {
    return;
  }

  const vecchioElemento = elementoSelezionato;
  const nuovoElemento = creaElemento(immagineAsideSelezionata);
  const posizione = elementiInseriti.indexOf(vecchioElemento);

  vecchioElemento.replaceWith(nuovoElemento);

  if (posizione !== -1) {
    elementiInseriti[posizione] = nuovoElemento;
  }

  cronologia.push({
    tipo: "sostituzione",
    vecchioElemento: vecchioElemento,
    nuovoElemento: nuovoElemento,
    posizione: posizione,
  });

  deselezionaTutto();
}

function eliminaElementoSelezionato() {
  if (elementoSelezionato === null) {
    return;
  }

  const elemento = elementoSelezionato;
  const posizione = elementiInseriti.indexOf(elemento);

  cronologia.push({
    tipo: "eliminazione",
    elemento: elemento,
    posizione: posizione,
  });

  if (posizione !== -1) {
    elementiInseriti.splice(posizione, 1);
  }

  elemento.remove();
  deselezionaTutto();
}

function annullaUltimaAzione() {
  const azione = cronologia.pop();

  if (azione === undefined) {
    return;
  }

  if (azione.tipo === "inserimento") {
    azione.elemento.remove();

    const posizione = elementiInseriti.indexOf(azione.elemento);

    if (posizione !== -1) {
      elementiInseriti.splice(posizione, 1);
    }
  }

  if (azione.tipo === "eliminazione") {
    const riferimento = elementiInseriti[azione.posizione];

    if (riferimento) {
      riferimento.before(azione.elemento);
    } else {
      foglio.appendChild(azione.elemento);
    }

    elementiInseriti.splice(azione.posizione, 0, azione.elemento);
  }

  if (azione.tipo === "sostituzione") {
    azione.nuovoElemento.replaceWith(azione.vecchioElemento);
    elementiInseriti[azione.posizione] = azione.vecchioElemento;
  }

  if (azione.tipo === "random") {
    foglio.innerHTML = azione.htmlPrecedente;
    elementiInseriti.length = 0;

    for (const elemento of foglio.querySelectorAll(".elemento")) {
      elementiInseriti.push(elemento);
    }
  }

  deselezionaTutto();
}

function svuotaFoglio() {
  const conferma = window.confirm(
    "Vuoi davvero rimuovere tutti gli elementi dal foglio?",
  );

  if (conferma === false) {
    return;
  }

  foglio.innerHTML = "";
  elementiInseriti.length = 0;
  cronologia.length = 0;

  deselezionaTutto();
}

function deselezionaTutto() {
  if (elementoSelezionato !== null) {
    elementoSelezionato.classList.remove("selezionato");
  }

  if (immagineAsideSelezionata !== null) {
    immagineAsideSelezionata.classList.remove("selezionato");
  }

  elementoSelezionato = null;
  immagineAsideSelezionata = null;
}

function disposizioneRandom() {
  const immaginiDisponibili = Array.from(
    menuElementi.querySelectorAll(".elemento-menu"),
  );

  if (immaginiDisponibili.length === 0) {
    return;
  }

  const htmlPrecedente = foglio.innerHTML;
  const nuovaDisposizione = [];
  const numeroElementi = Math.floor(Math.random() * 8) + 1;

  for (let i = 0; i < numeroElementi; i++) {
    const indiceCasuale = Math.floor(
      Math.random() * immaginiDisponibili.length,
    );

    nuovaDisposizione.push(creaElemento(immaginiDisponibili[indiceCasuale]));
  }

  cronologia.push({
    tipo: "random",
    htmlPrecedente: htmlPrecedente,
  });

  foglio.innerHTML = "";
  elementiInseriti.length = 0;

  for (const elemento of nuovaDisposizione) {
    foglio.appendChild(elemento);
    elementiInseriti.push(elemento);
  }

  deselezionaTutto();
}

async function scaricaFoglio() {
  try {
    const larghezza = Math.max(foglio.scrollWidth, foglio.clientWidth);
    const altezza = Math.max(foglio.scrollHeight, foglio.clientHeight);

    const immagine = await htmlToImage.toPng(foglio, {
      backgroundColor: "#ffffff",
      pixelRatio: 1,
      width: larghezza,
      height: altezza,
      style: {
        width: `${larghezza}px`,
        height: `${altezza}px`,
        overflow: "visible",
        border: "none",
        borderRight: "none",
        borderRightWidth: "0",
        outline: "none",
        boxShadow: "none",
      },
    });

    const link = document.createElement("a");
    link.download = "WebboLayout.png";
    link.href = immagine;
    link.click();
  } catch (errore) {
    console.error("Errore durante il download:", errore);
    alert("Non è stato possibile scaricare il foglio. Controlla la Console.");
  }
}

function muoviElementoSu() {
  if (elementoSelezionato === null) {
    return;
  }

  const posizione = elementiInseriti.indexOf(elementoSelezionato);

  if (posizione <= 0) {
    return;
  }

  const elementoSopra = elementiInseriti[posizione - 1];

  elementoSopra.before(elementoSelezionato);

  elementiInseriti[posizione - 1] = elementoSelezionato;
  elementiInseriti[posizione] = elementoSopra;

  cronologia.push({
    tipo: "scambio",
    elementoA: elementoSelezionato,
    elementoB: elementoSopra,
  });
}

function muoviElementoGiu() {
  if (elementoSelezionato === null) {
    return;
  }

  const posizione = elementiInseriti.indexOf(elementoSelezionato);

  if (posizione === -1 || posizione === elementiInseriti.length - 1) {
    return;
  }

  const elementoSotto = elementiInseriti[posizione + 1];

  elementoSotto.after(elementoSelezionato);

  elementiInseriti[posizione + 1] = elementoSelezionato;
  elementiInseriti[posizione] = elementoSotto;

  cronologia.push({
    tipo: "scambio",
    elementoA: elementoSelezionato,
    elementoB: elementoSotto,
  });
}
