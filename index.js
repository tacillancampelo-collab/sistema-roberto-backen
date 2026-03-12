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

app.get("/", (req, res) => {
  res.json({ status: "online", sistema: "Roberto - Papelcenter", versao: "4.0" });
});

app.get("/teste-kommo", async (req, res) => {
  try {
    const token = process.env.KOMMO_LONG_LIVED_TOKEN;
    const subdomain = process.env.KOMMO_SUBDOMAIN;
    console.log("Testando token Kommo...");
    console.log("Subdomain:", subdomain);
    console.log("Token (primeiros 20 chars):", token ? token.substring(0, 20) : "VAZIO");
    const response = await fetch(`https://${subdomain}.kommo.com/api/v4/account`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const text = await response.text();
    console.log("Resposta teste:", text.substring(0, 500));
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
    console.error("Erro leads:", error.message);
    res.status(500).json({ erro: error.message });
  }
});

app.post("/webhook/kommo", (req, res) => {
  const payload = req.body;
  console.log("Webhook Kommo:", JSON.stringify(payload, null, 2));
  try {
    if (payload.leads && payload.leads.add) {
      payload.leads.add.forEach(function(lead) {
        console.log("Novo lead: " + lead.name + " | ID: " + lead.id);
      });
    }
    if (payload.leads && payload.leads.status) {
      payload.leads.status.forEach(function(lead) {
        console.log("Lead mudou de etapa: " + lead.name);
      });
    }
    if (payload.message && payload.message.add) {
      payload.message.add.forEach(function(msg) {
        console.log("Mensagem: " + (msg.author ? msg.author.name : "") + " | " + msg.text);
      });
    }
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(200).json({ ok: true });
  }
});

app.get("/webhook/whatsapp", (req, res) => {
  var VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "sistema-roberto-2024";
  var mode = req.query["hub.mode"];
  var token = req.query["hub.verify_token"];
  var challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).json({ erro: "Token inválido" });
  }
});

app.post("/webhook/whatsapp", function(req, res) {
  var payload = req.body;
  try {
    var entry = payload.entry && payload.entry[0];
    var changes = entry && entry.changes && entry.changes[0];
    var value = changes && changes.value;
    var mensagem = value && value.messages && value.messages[0];
    if (mensagem) {
      console.log("De: " + mensagem.from + " | Texto: " + (mensagem.text ? mensagem.text.body : ""));
    }
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(200).json({ ok: true });
  }
});

app.post("/pedro/chat", async (req, res) => {
  var mensagem = req.body.mensagem;
  var historico = req.body.historico || [];
  if (!mensagem) {
    return res.status(400).json({ erro: "Mensagem não informada" });
  }
  try {
    var contextoLeads = "";
    try {
      var leads = await buscarLeadsRoberto();
      var agora = Date.now() / 1000;
      var leadsParados = leads.filter(function(l) {
        return ((agora - (l.updated_at || 0)) / 3600) > 24;
      });
      contextoLeads = "\n\nDADOS ATUAIS DO KOMMO:\n- Total de leads do Roberto: " + leads.length + "\n- Leads parados há mais de 24h: " + leadsParados.length + "\n- Leads: " + leads.map(function(l) { return l.name + " (ID: " + l.id + ")"; }).join(", ");
    } catch (e) {
      console.log("Leads indisponíveis:", e.message);
    }

    var systemPrompt = (process.env.PEDRO_SYSTEM_PROMPT || "Você é Pedro, assistente pessoal do Roberto.") + contextoLeads;
    var messages = historico.concat([{ role: "user", content: mensagem }]);

    var response = await fetch("https://api.anthropic.com/v1/messages", {
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
        messages: messages
      })
    });

    var data = await response.json();
    res.json({ resposta: data.content && data.content[0] ? data.content[0].text : "", ok: true });
  } catch (error) {
    console.error("Erro Pedro:", error);
    res.status(500).json({ erro: "Erro ao processar mensagem" });
  }
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Sistema Roberto backend v4.0 rodando na porta " + PORT);
});
