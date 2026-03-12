const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS — permite requisições do Lovable
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

app.get("/", (req, res) => {
  res.json({ status: "online", sistema: "Roberto - Papelcenter", versao: "1.0" });
});

app.post("/webhook/kommo", (req, res) => {
  const payload = req.body;
  console.log("📥 Webhook Kommo recebido:", JSON.stringify(payload, null, 2));

  try {
    const processarLead = (lead) => {
      const temEtiquetaRoberto = JSON.stringify(lead).toLowerCase().includes("roberto");
      if (!temEtiquetaRoberto) {
        console.log(`⏭️ Lead ignorado — não é do Roberto: ${lead.name}`);
        return false;
      }
      return true;
    };

    if (payload.leads?.add) {
      payload.leads.add.forEach((lead) => {
        if (processarLead(lead)) {
          console.log(`🆕 Novo lead do Roberto: ${lead.name} | ID: ${lead.id}`);
        }
      });
    }

    if (payload.leads?.status) {
      payload.leads.status.forEach((lead) => {
        if (processarLead(lead)) {
          console.log(`🔄 Lead do Roberto mudou de etapa: ${lead.name}`);
        }
      });
    }

    if (payload.leads?.update) {
      payload.leads.update.forEach((lead) => {
        if (processarLead(lead)) {
          console.log(`✏️ Lead do Roberto atualizado: ID ${lead.id}`);
        }
      });
    }

    if (payload.message?.add) {
      payload.message.add.forEach((msg) => {
        console.log(`💬 Mensagem: ${msg.author?.name} | ${msg.text}`);
      });
    }

    res.status(200).json({ ok: true });

  } catch (error) {
    console.error("Erro no webhook Kommo:", error);
    res.status(200).json({ ok: true });
  }
});

app.get("/webhook/whatsapp", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "sistema-roberto-2024";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WhatsApp webhook verificado");
    res.status(200).send(challenge);
  } else {
    res.status(403).json({ erro: "Token inválido" });
  }
});

app.post("/webhook/whatsapp", async (req, res) => {
  const payload = req.body;
  try {
    const mensagem = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (mensagem) {
      console.log(`📩 De: ${mensagem.from} | Texto: ${mensagem.text?.body}`);
    }
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Erro WhatsApp:", error);
    res.status(200).json({ ok: true });
  }
});

app.post("/pedro/chat", async (req, res) => {
  const { mensagem, historico } = req.body;
  if (!mensagem) return res.status(400).json({ erro: "Mensagem não informada" });

  try {
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
        system: process.env.PEDRO_SYSTEM_PROMPT || "Você é Pedro, assistente pessoal do Roberto, dono da Papelcenter.",
        messages: [...(historico || []), { role: "user", content: mensagem }]
      })
    });

    const data = await response.json();
    console.log("Pedro respondeu:", data.content?.[0]?.text);
    res.json({ resposta: data.content?.[0]?.text, ok: true });

  } catch (error) {
    console.error("Erro Pedro:", error);
    res.status(500).json({ erro: "Erro ao processar mensagem" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Sistema Roberto backend rodando na porta ${PORT}`);
});
