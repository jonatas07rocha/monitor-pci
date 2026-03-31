/**
 * MONITOR DE CONCURSOS - PSICOLOGIA (PCI CONCURSOS)
 * Versão Cloud (GitHub Actions + Bun)
 */

// Lendo credenciais das variáveis de ambiente do GitHub
const TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const URL_PCI = "https://www.pciconcursos.com.br/cargos/psicologo";
const CACHE_FILE = "pci_cache.json";

const UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
             "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SE","TO"];

async function buscarConcursos() {
  console.log(`[${new Date().toLocaleString('pt-BR')}] Iniciando busca via GitHub Actions...`);
  
  if (!TOKEN || !CHAT_ID) {
    console.error("ERRO: TELEGRAM_TOKEN ou TELEGRAM_CHAT_ID não configurados nos Secrets.");
    return;
  }

  try {
    const response = await fetch(URL_PCI);
    const html = await response.text();
    
    const blocos = html.split('<ul class="link-d">');
    let resultados = [];

    for (let i = 1; i < blocos.length; i++) {
      let bloco = blocos[i];
      
      let orgaoMatch = bloco.match(/class="noticia_desc[^"]*">(.*?)<\/a>/);
      let orgao = orgaoMatch ? orgaoMatch[1].replace(/\s+/g, " ").trim() : null;

      let cargoMatch = bloco.match(/<ul class="link-i">[\s\S]*?<a[^>]*>(.*?)<\/a>/);
      let cargo = cargoMatch 
        ? cargoMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() 
        : null;

      if (orgao && cargo) resultados.push({ orgao, cargo });
    }

    let filtrados = resultados.filter(item => {
      const upper = (item.orgao + " " + item.cargo).toUpperCase();
      if (!upper.includes("PSICÓLOGO")) return false;
      if (upper.includes(" - SP")) return true;
      return !UFS.some(uf => upper.includes(" - " + uf));
    });

    // Lendo cache do arquivo salvo pelo GitHub Action
    let antigos = [];
    const file = Bun.file(CACHE_FILE);
    if (await file.exists()) {
      antigos = await file.json();
    }

    const novos = filtrados.filter(n => 
      !antigos.some(a => a.orgao === n.orgao && a.cargo === n.cargo)
    );

    if (novos.length > 0) {
      await enviarParaTelegram(novos);
    } else {
      console.log("Nenhum concurso novo detectado nesta rodada.");
    }

    // Grava o novo estado para ser persistido pelo próximo workflow
    await Bun.write(CACHE_FILE, JSON.stringify(filtrados, null, 2));

  } catch (error) {
    console.error("Erro crítico na execução:", error.message);
  }
}

async function enviarParaTelegram(lista) {
  let mensagem = "<b>🔔 Novos Concursos de Psicologia!</b>\n\n";
  
  lista.forEach(item => {
    mensagem += `🏛️ <b>${item.orgao}</b>\n👉 ${item.cargo}\n\n`;
  });

  mensagem += `<a href="${URL_PCI}">Ver no site PCI Concursos</a>`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensagem,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    
    if (res.ok) {
      console.log(`${lista.length} notificações enviadas com sucesso.`);
    } else {
      console.error("Erro na API do Telegram:", await res.text());
    }
  } catch (e) {
    console.error("Erro de conexão com Telegram:", e.message);
  }
}

// Executa uma única vez por chamada do GitHub Actions
buscarConcursos();
