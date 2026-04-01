/**
 * MONITOR DE CONCURSOS - PSICOLOGIA
 * Rodando com Bun.sh via GitHub Actions
 */

const TOKEN = '8253608352:AAFjouw_xwcTX3KH0-GSbIRqTMMcyOgZMUI';
const CHAT_ID = '8045179125';
const CACHE_FILE = "pci_cache.json";
const URL_FONTE = "https://www.pciconcursos.com.br/cargos/psicologo";
const TERMO_BUSCA = "PSICÓLOGO";

const UFS_EXCLUIR = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
                     "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SE","TO"];

async function buscarConcursos() {
  console.log(`[${new Date().toLocaleTimeString('pt-BR')}] Iniciando varredura para Psicologia...`);
  
  try {
    const response = await fetch(URL_FONTE);
    const html = await response.text();
    
    // Captura links de notícias (editais reais) que apontam para a estrutura de notícias do PCI
    const regexNoticia = /<a[^>]+href="(https:\/\/www\.pciconcursos\.com\.br\/noticias\/[^"]+)"[^>]*>(.*?)<\/a>/g;
    
    let todosResultados = [];
    let match;

    while ((match = regexNoticia.exec(html)) !== null) {
      const urlEdital = match[1];
      const orgaoRaw = match[2].replace(/<[^>]+>/g, "").trim();
      
      // Filtro de segurança contra links de navegação
      if (orgaoRaw.length < 5 || orgaoRaw.includes("Próxima")) continue;

      // Extrai o contexto (600 caracteres) para validar cargo e UF
      const indexPos = html.indexOf(match[0]);
      const contexto = html.substring(indexPos, indexPos + 600).replace(/<[^>]+>/g, " ").toUpperCase();

      const infoFiltro = (orgaoRaw + " " + contexto).toUpperCase();

      // Regras: Deve conter PSICÓLOGO e (ser de SP ou não ter UF de outro estado)
      const contemCargo = infoFiltro.includes(TERMO_BUSCA);
      const ehSP = infoFiltro.includes("- SP") || infoFiltro.includes("SÃO PAULO");
      const ehNacional = !UFS_EXCLUIR.some(uf => infoFiltro.includes("- " + uf));

      if (contemCargo && (ehSP || ehNacional)) {
        todosResultados.push({ 
          orgao: orgaoRaw, 
          url: urlEdital 
        });
      }
    }

    // Remove duplicatas de URLs
    const unicos = todosResultados.filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);

    // Gerenciamento de Cache (Persistência no GitHub)
    let antigos = [];
    const file = Bun.file(CACHE_FILE);
    if (await file.exists()) {
      antigos = await file.json();
    }

    const novos = unicos.filter(n => !antigos.some(a => a.url === n.url));

    if (novos.length > 0) {
      await enviarParaTelegram(novos);
    } else {
      console.log("🏁 Tudo atualizado. Nenhuma vaga nova de Psicologia em SP/Nacional.");
    }

    // Atualiza o cache
    await Bun.write(CACHE_FILE, JSON.stringify(unicos, null, 2));

  } catch (error) {
    console.error("❌ Erro no monitor de Psicologia:", error.message);
  }
}

async function enviarParaTelegram(lista) {
  let mensagem = "<b>🔔 Novos Concursos: Psicologia</b>\n\n";
  
  lista.forEach(item => {
    mensagem += `🏛️ <b>${item.orgao}</b>\n`;
    mensagem += `🔗 <a href="${item.url}">Ver detalhes no PCI</a>\n\n`;
  });

  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensagem,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    console.log(`🚀 ${lista.length} alerta(s) de Psicologia enviado(s)!`);
  } catch (e) {
    console.error("Erro Telegram:", e.message);
  }
}

// Execução imediata (necessário para o GitHub Actions)
buscarConcursos();
