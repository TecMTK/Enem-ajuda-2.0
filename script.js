const temas = [
  "Desafios para o enfrentamento da violência contra a mulher no Brasil.",
  "O combate à intolerância religiosa na sociedade brasileira.",
  "Caminhos para promover a inclusão de pessoas com deficiência na sociedade.",
  "Desafios para a valorização dos povos originários no Brasil contemporâneo.",
  "O impacto da desinformação e das fake news na construção social.",
  "A promoção da saúde mental na sociedade brasileira.",
  "O enfrentamento do racismo estrutural no Brasil.",
  "Os desafios da mobilidade urbana para a inclusão social.",
  "Meios para combater o discurso de ódio nas redes sociais.",
  "A importância da educação digital para o uso consciente da internet."
];

let temaSorteado = "";
let palavrasChaveTema = [];

function sortearTema() {
  const lista = document.getElementById("lista-temas");
  lista.innerHTML = "";
  temaSorteado = temas[Math.floor(Math.random() * temas.length)];
  const li = document.createElement("li");
  li.textContent = temaSorteado;
  lista.appendChild(li);

  gerarPalavrasChave(temaSorteado);
}

function gerarPalavrasChave(tema) {
  const palavras = tema
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .split(" ")
    .filter(p => p.length > 3 && !["para", "com", "dos", "das", "nos", "nas", "uma", "que", "e", "de", "na", "no", "da", "do", "em"].includes(p));
  palavrasChaveTema = [...new Set(palavras)];
}

function contarCaracteres() {
  const texto = document.getElementById("editor").innerText.trim();
  document.getElementById("contador").textContent = `${texto.length} / 3000 caracteres`;
}

function salvarRedacao() {
  const texto = document.getElementById("editor").innerText.trim();
  const blob = new Blob([texto], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "redacao_enem.txt";
  link.click();
}

function corrigirRedacao() {
  const texto = document.getElementById("editor").innerText.trim();
  const resultado = document.getElementById("resultado-correcao");

  if (!temaSorteado) {
    alert("Por favor, sorteie um tema antes de corrigir.");
    return;
  }

  if (texto.length < 300) {
    resultado.innerHTML = `<strong>Nota: 400 / 1000</strong><br>⚠️ Sua redação está muito curta. Desenvolva mais seus argumentos e traga uma proposta de intervenção.`;
    return;
  }

  let competencias = { C1: 0, C2: 0, C3: 0, C4: 0, C5: 0 };

  const palavras = texto.toLowerCase().replace(/[.,!?;()]/g, "").split(/\s+/);
  const frases = texto.split(/[.!?]/).filter(f => f.trim().length > 5);
  const palavrasUnicas = new Set(palavras.filter(p => p.length > 2));

  const palavrasTemaPresentes = palavrasChaveTema.filter(p => palavras.includes(p));
  const aderenciaTema = palavrasTemaPresentes.length / palavrasChaveTema.length;

  competencias.C1 = texto.match(/[áéíóúãõç]/gi) ? 160 : 100;
  if (texto.length > 2000) competencias.C1 += 40;

  if (aderenciaTema >= 0.7) {
    competencias.C2 = 200;
  } else if (aderenciaTema >= 0.4) {
    competencias.C2 = 160;
  } else {
    competencias.C2 = 100;
  }

  competencias.C3 = frases.length > 7 ? 200 : frases.length > 4 ? 160 : 120;

  const conectivos = ["portanto", "além disso", "desse modo", "dessa forma", "consequentemente", "em síntese"];
  const usados = conectivos.filter(p => texto.toLowerCase().includes(p));
  competencias.C4 = usados.length >= 4 ? 200 : usados.length >= 2 ? 160 : 120;

  competencias.C5 = texto.toLowerCase().includes("portanto") ? 200 : 120;

  for (let c in competencias) {
    competencias[c] = Math.min(200, Math.max(0, competencias[c]));
  }

  const notaFinal = competencias.C1 + competencias.C2 + competencias.C3 + competencias.C4 + competencias.C5;

  resultado.innerHTML = `
    <strong>Nota: ${notaFinal} / 1000</strong><br><br>
    <strong>Competência 1:</strong> ${competencias.C1} / 200 (Norma Culta)<br>
    <strong>Competência 2:</strong> ${competencias.C2} / 200 (Aderência ao Tema)<br>
    <strong>Competência 3:</strong> ${competencias.C3} / 200 (Argumentação)<br>
    <strong>Competência 4:</strong> ${competencias.C4} / 200 (Coesão Textual)<br>
    <strong>Competência 5:</strong> ${competencias.C5} / 200 (Proposta de Intervenção)<br><br>
    🔍 <strong>Checagem de tema:</strong> ${Math.round(aderenciaTema * 100)}% de aderência.<br><br>
    📝 <em>Atenção:</em> Esta é uma correção automatizada simulada e não substitui uma correção humana.
  `;
}

sortearTema();
