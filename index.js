const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

const kommoRequest = async (endpoint) => {
  const url = `https://${process.env.KOMMO_SUBDOMAIN}.kommo.com/api/v4${endpoint}`;
  const token = process.env.KOMMO_LONG_LIVED_TOKEN;
  console.log("Chamando Kommo:", url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  const text = await response.text();
  console.log("Resposta Kommo:", text.substring(0, 300));
  return JSON.parse(text);
};

const buscarLeadsRoberto = async () => {
  const data = await kommoRequest("/leads?with=contacts,tags&limit=50");
  const leads = data?._embedded?.leads || [];
  return leads.filter(lead => {
    const tags = lead._embedded?.tags || [];
    return tags.some(tag => tag.name?.toLowerCase() === "roberto");
  });
};

// ============================================================
// HELPER: Chamada Claude API
// ============================================================
const claudeAPI = async (prompt, systemPrompt, maxTokens = 2500) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await response.json();
  return data.content?.[0]?.text || "";
};

// ============================================================
// ROTAS EXISTENTES
// ============================================================

app.get("/api/status", (req, res) => {
  res.json({ status: "online", sistema: "Social Media Studio", versao: "5.0" });
});

app.get("/teste-kommo", async (req, res) => {
  try {
    const token = process.env.KOMMO_LONG_LIVED_TOKEN;
    const subdomain = process.env.KOMMO_SUBDOMAIN;
    const response = await fetch(`https://${subdomain}.kommo.com/api/v4/account`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const text = await response.text();
    res.send(text);
  } catch (e) {
    res.json({ erro: e.message });
  }
});

app.get("/leads", async (req, res) => {
  try {
    const leads = await buscarLeadsRoberto();
    res.json({ leads, total: leads.length, ok: true });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.post("/webhook/kommo", (req, res) => {
  const payload = req.body;
  try {
    if (payload.leads?.add) payload.leads.add.forEach(l => console.log("Novo lead:", l.name));
    if (payload.leads?.status) payload.leads.status.forEach(l => console.log("Lead etapa:", l.name));
    if (payload.message?.add) payload.message.add.forEach(m => console.log("Mensagem:", m.text));
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(200).json({ ok: true });
  }
});

app.get("/webhook/whatsapp", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "sistema-roberto-2024";
  const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = req.query;
  if (mode === "subscribe" && token === VERIFY_TOKEN) res.status(200).send(challenge);
  else res.status(403).json({ erro: "Token inválido" });
});

app.post("/webhook/whatsapp", (req, res) => {
  try {
    const mensagem = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (mensagem) console.log("WhatsApp de:", mensagem.from, "| Texto:", mensagem.text?.body);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(200).json({ ok: true });
  }
});

app.post("/pedro/chat", async (req, res) => {
  const { mensagem, historico = [] } = req.body;
  if (!mensagem) return res.status(400).json({ erro: "Mensagem não informada" });
  try {
    let contextoLeads = "";
    try {
      const leads = await buscarLeadsRoberto();
      const agora = Date.now() / 1000;
      const leadsParados = leads.filter(l => ((agora - (l.updated_at || 0)) / 3600) > 24);
      contextoLeads = `\n\nDADOS ATUAIS DO KOMMO:\n- Total de leads do Roberto: ${leads.length}\n- Leads parados há mais de 24h: ${leadsParados.length}`;
    } catch (e) {}
    const systemPrompt = (process.env.PEDRO_SYSTEM_PROMPT || "Você é Pedro, assistente pessoal do Roberto.") + contextoLeads;
    const messages = historico.concat([{ role: "user", content: mensagem }]);
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: systemPrompt, messages })
    });
    const data = await response.json();
    res.json({ resposta: data.content?.[0]?.text || "", ok: true });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao processar mensagem" });
  }
});

// ============================================================
// SOCIAL MEDIA STUDIO - API ENDPOINTS
// ============================================================

// POST /api/social/copywriter
app.post("/api/social/copywriter", async (req, res) => {
  try {
    const { tipo = "post feed", nicho = "empreendedorismo feminino", produto = "produto premium", tom = "elegante e empoderador", objetivo = "engajamento e conversão" } = req.body;

    const systemPrompt = `Você é uma copywriter world-class especializada em conteúdo para Instagram focado em mulheres empreendedoras premium no Brasil.
Seu estilo é sofisticado, empoderador, autêntico e altamente persuasivo.
Você domina gatilhos mentais, storytelling e linguagem que ressoa com mulheres de 28-45 anos, bem-sucedidas, que buscam crescimento, sofisticação e resultados.
SEMPRE responda APENAS com JSON válido, sem markdown, sem texto extra.`;

    const prompt = `Crie copywriting poderoso para Instagram com estas especificações:
Tipo de conteúdo: ${tipo}
Nicho: ${nicho}
Produto/Serviço: ${produto}
Tom de voz: ${tom}
Objetivo: ${objetivo}

Retorne SOMENTE este JSON (sem markdown):
{
  "hook": "gancho inicial impactante (máx 15 palavras, que para o scroll)",
  "legenda_curta": "legenda completa curta ideal para post (150-300 chars com emojis estratégicos)",
  "legenda_longa": "legenda completa para feed (800-1500 chars, com quebras de linha \\n, storytelling, emojis, CTA)",
  "headline": "título principal para artes/carrossel (máx 8 palavras)",
  "subheadline": "subtítulo complementar (máx 12 palavras)",
  "cta": "chamada para ação específica e urgente",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8", "hashtag9", "hashtag10", "hashtag11", "hashtag12", "hashtag13", "hashtag14", "hashtag15"],
  "sugestao_visual": "descrição do visual ideal para acompanhar este conteúdo"
}`;

    const result = await claudeAPI(prompt, systemPrompt, 2500);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ ok: false, erro: "Falha ao gerar conteúdo" });
    const data = JSON.parse(jsonMatch[0]);
    res.json({ ok: true, data });
  } catch (error) {
    console.error("Erro copywriter:", error.message);
    res.status(500).json({ ok: false, erro: error.message });
  }
});

// GET /api/social/trends
app.get("/api/social/trends", async (req, res) => {
  try {
    const systemPrompt = `Você é uma estrategista de conteúdo digital de elite especializada em tendências do Instagram para o mercado feminino premium no Brasil.
Você monitora constantemente o que está funcionando, o que está em alta e o que gera engajamento para mulheres empreendedoras.
SEMPRE responda APENAS com JSON válido, sem markdown, sem texto extra.`;

    const prompt = `Analise as tendências atuais de conteúdo do Instagram (abril 2026) para mulheres empreendedoras premium no Brasil.

Retorne SOMENTE este JSON (sem markdown):
{
  "trending_temas": [
    {
      "tema": "nome do tema tendência",
      "descricao": "por que está em alta e como aproveitar",
      "nivel_engajamento": "muito alto",
      "formatos_ideais": ["reels", "carrossel"],
      "hook_exemplo": "exemplo de gancho para esse tema",
      "emoji": "🔥"
    }
  ],
  "formatos_virais": [
    {
      "formato": "nome do formato",
      "descricao": "como funciona",
      "por_que_funciona": "psicologia por trás",
      "dica_implementacao": "como usar hoje"
    }
  ],
  "paletas_tendencia": [
    {
      "nome": "nome da paleta",
      "cores": ["#hex1", "#hex2", "#hex3", "#hex4"],
      "vibe": "descrição do estilo/sentimento",
      "ideal_para": "tipo de conteúdo"
    }
  ],
  "hooks_virais": ["hook 1 em alta", "hook 2 em alta", "hook 3 em alta", "hook 4 em alta", "hook 5 em alta"],
  "erros_evitar": ["erro comum 1", "erro comum 2", "erro comum 3"]
}

Foque em conteúdo sofisticado, premium, autêntico para mulheres de sucesso.`;

    const result = await claudeAPI(prompt, systemPrompt, 3000);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ ok: false, erro: "Falha ao buscar tendências" });
    const data = JSON.parse(jsonMatch[0]);
    res.json({ ok: true, data });
  } catch (error) {
    console.error("Erro trends:", error.message);
    res.status(500).json({ ok: false, erro: error.message });
  }
});

// POST /api/social/hashtags
app.post("/api/social/hashtags", async (req, res) => {
  try {
    const { tema = "empreendedorismo feminino", nicho = "negócios premium" } = req.body;

    const systemPrompt = `Você é especialista em estratégia de hashtags para Instagram para o mercado feminino premium brasileiro.
Você sabe exatamente quais hashtags geram alcance orgânico e engajamento qualificado para cada nicho.
SEMPRE responda APENAS com JSON válido.`;

    const prompt = `Crie uma estratégia completa de hashtags para Instagram:
Tema: ${tema}
Nicho: ${nicho}
Público: mulheres empreendedoras premium, Brasil

Retorne SOMENTE este JSON:
{
  "estrategia_resumida": "como usar essas hashtags para máximo resultado",
  "hashtags_nicho": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "hashtags_medio_alcance": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "hashtags_alto_alcance": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "hashtags_tendencia": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "hashtags_publico_feminino": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "mix_recomendado": "texto com a combinação ideal das 30 hashtags",
  "hashtag_branded_sugestao": "#NomeIdealParaSuaMarca"
}`;

    const result = await claudeAPI(prompt, systemPrompt, 1500);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ ok: false, erro: "Falha ao gerar hashtags" });
    const data = JSON.parse(jsonMatch[0]);
    res.json({ ok: true, data });
  } catch (error) {
    console.error("Erro hashtags:", error.message);
    res.status(500).json({ ok: false, erro: error.message });
  }
});

// POST /api/social/content-ideas
app.post("/api/social/content-ideas", async (req, res) => {
  try {
    const { nicho = "empreendedorismo feminino premium", objetivo = "crescimento e vendas", quantidade = 10 } = req.body;

    const systemPrompt = `Você é uma estrategista de conteúdo criativa e especializada em criar ideias de conteúdo viral e de alto impacto para mulheres empreendedoras premium no Instagram.
Suas ideias são originais, autênticas, conectam emocionalmente e geram resultados.
SEMPRE responda APENAS com JSON válido.`;

    const prompt = `Crie ${quantidade} ideias poderosas de conteúdo para Instagram:
Nicho: ${nicho}
Objetivo: ${objetivo}
Público: mulheres empreendedoras, 28-45 anos, renda premium, Brasil

Retorne SOMENTE este JSON:
{
  "ideias": [
    {
      "id": 1,
      "titulo": "título criativo da ideia",
      "formato": "reels",
      "categoria": "educacional",
      "descricao": "descrição detalhada de como executar",
      "hook": "gancho inicial sugerido",
      "objetivo_principal": "engajamento",
      "nivel_producao": "fácil",
      "potencial_viral": "alto",
      "emoji": "💫"
    }
  ]
}`;

    const result = await claudeAPI(prompt, systemPrompt, 3500);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ ok: false, erro: "Falha ao gerar ideias" });
    const data = JSON.parse(jsonMatch[0]);
    res.json({ ok: true, data });
  } catch (error) {
    console.error("Erro content ideas:", error.message);
    res.status(500).json({ ok: false, erro: error.message });
  }
});

// POST /api/social/carousel-script
app.post("/api/social/carousel-script", async (req, res) => {
  try {
    const { tema = "estratégias para empreendedoras", slides = 7, nicho = "negócios femininos premium" } = req.body;

    const systemPrompt = `Você é especialista em criação de carrosséis virais para Instagram que geram alto salvamento e compartilhamento.
Você cria roteiros precisos, com textos concisos e impactantes para mulheres empreendedoras premium.
SEMPRE responda APENAS com JSON válido.`;

    const prompt = `Crie o roteiro completo de um carrossel viral para Instagram:
Tema: ${tema}
Slides: ${slides}
Nicho: ${nicho}

Retorne SOMENTE este JSON:
{
  "titulo_carrossel": "título principal do carrossel",
  "promessa": "o que o leitor vai ganhar ao ler",
  "slides": [
    {
      "numero": 1,
      "tipo": "capa",
      "titulo": "título do slide (max 6 palavras)",
      "subtitulo": "subtítulo complementar (opcional)",
      "texto_corpo": "texto principal do slide (conciso, max 3 linhas)",
      "elemento_visual": "sugestão do elemento visual",
      "cor_destaque": "#C9A84C"
    }
  ],
  "legenda_post": "legenda completa para publicar com o carrossel",
  "cta_ultimo_slide": "chamada para ação do último slide",
  "dica_design": "dica principal de design para esse carrossel"
}`;

    const result = await claudeAPI(prompt, systemPrompt, 3000);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ ok: false, erro: "Falha ao gerar roteiro" });
    const data = JSON.parse(jsonMatch[0]);
    res.json({ ok: true, data });
  } catch (error) {
    console.error("Erro carousel script:", error.message);
    res.status(500).json({ ok: false, erro: error.message });
  }
});

// Rota raiz redireciona para o studio
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Social Media Studio v5.0 rodando na porta ${PORT}`);
});
