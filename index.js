const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

const kommoRequest = async (endpoint, method = "GET", body = null) => {
  const BASE = `https://${process.env.KOMMO_SUBDOMAIN}.kommo.com/api/v4`;
  const options = {
    method,
    headers: {
      "Authorization": `Bearer ${process.env.KOMMO_LONG_LIVED_TOKEN}`,
      "Content-Type": "application/json"
    }
  };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(`${BASE}${endpoint}`, options);
  return response.json();
};

const buscarLeadsRoberto = async () => {
  const data = await kommoRequest("/leads?with=contacts,tags&limit=50");
  const leads = data?._embedded?.leads || [];
  return leads.filter(lead => {
    const tags = lead._embedded?.tags || [];
    return tags.some(tag => tag.name?.toLowerCase() === "roberto");
  });
};

app.get("/", (req, res) => {
  res.json({ status: "online", sistema: "Roberto - Papelcenter", versao: "2.0" });
});

// ROTA DE CALLBACK — troca código por token
app.get("/kommo/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ erro: "Código não informado" });

  try {
    const response = await fetch(`https://${process.env.KOMMO_SUBDOMAIN}.kommo.com/oauth2/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.KOMMO_CLIENT_ID,
        client_secret: process.env.KOMMO_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: `https://sistema-roberto-backen-production.up.railway.app/kommo/callback`
      })
    });

    const data = await response.json();
    console.log("Token Kommo:", JSON.stringify(data, null, 2));

    if (data.access_token) {
      console.log("✅ ACCESS TOKEN:", data.access_token);
      console.log("✅ REFRESH TOKEN:", data.refresh_token);
      res.json({ 
        ok: true, 
        mensagem: "Token gerado com sucesso! Copie o access_token abaixo e coloque no Railway como KOMMO_LONG_LIVED_TOKEN",
        access_token: data.access_token,
        refresh_token: data.refresh_token
      });
    } else {
      res.json({ erro: "Falhou", detalhes: data });
    }
  } catch (error) {
    console.error("Erro callback:", error);
    res.status(500).json({ erro: error.message });
  }
});

app.get("/leads", async (req, res) => {
  try {
    const leads = await buscarLeadsRoberto();
    res.json({ leads, total: leads.length, ok: true });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar leads do Kommo" });
  }
});

app.post("/webhook/kommo", (req, res) => {
  const payload = req.body;
  console.log("📥 Webhook Kommo:", JSON.stringify(payload, null, 2));
  try {
    if (payload.leads?.add) {
      payload.leads.add.forEach((lead) => {
        console.log(`🆕 Novo lead: ${lead.name} | ID: ${lead.id}`);
      });
    }
    if (payload.leads?.status) {
      payload.leads.status.forEach((lead) => {
        console.log(`🔄 Lead mudou de etapa: ${lead.name}`);
      });
    }
    if (payload.message?.add) {
      payload.message.add.forEach((msg) => {
        console.log(`💬 Mensagem: ${msg.author?.name} | ${msg.text}`);
      });
    }
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(200).json({ ok: true });
  }
});

app.get("/webhook/whatsapp", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "sistema-roberto-2024";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).json({ erro: "Token inválido" });
  }
});

app.post("/webhook/whatsapp", async (req, res) => {
  const payload = req.body;
  try {
    const mensagem = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (mensagem) console.log(`📩 De: ${mensagem.from} | Texto: ${mensagem.text?.body}`);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(200).json({ ok: true });
  }
});

app.post("/pedro/chat", async (req, res) => {
  const { mensagem, historico } = req.body;
  if (!mensagem) return res.status(400).json({ erro: "Mensagem não informada" });
  try {
    let contextoLeads = "";
    try {
      const leads = await buscarLeadsRoberto();
      const agora = Date.now() / 1000;
      const leadsParados = leads.filter(l => ((agora - (l.updated_at || 0)) / 3600) > 24);
      contextoLeads = `\n\nDADOS ATUAIS DO KOMMO:\n- Total de leads do Roberto: ${leads.length}\n- Leads parados há mais de 24h: ${leadsParados.length}\n- Leads: ${leads.map(l => `${l.name} (ID: ${l.id})`).join(", ")}`;
    } catch (e) {
      console.log("Não foi possível buscar leads:", e.message);
    }

    const systemPrompt = (process.env.PEDRO_SYSTEM_PROMPT || "Você é Pedro, assistente pessoal do Roberto.") + contextoLeads;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [...(historico || []), { role: "user", content: mensagem }]
      })
    });

    const data = await response.json();
    res.json({ resposta: data.content?.[0]?.text, ok: true });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao processar mensagem" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Sistema Roberto backend v2.0 rodando na porta ${PORT}`);
});
